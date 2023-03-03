<template>
  <div>
    <div class="card">
      <Toolbar class="mb-4">
        <template #start>
          <Button
            label="New"
            icon="pi pi-plus"
            class="p-button-success mr-2"
            @click="openNew"
          />
        </template>
      </Toolbar>
      <DataTable
        ref="dt"
        :value="texts"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Texts"
        responsiveLayout="scroll"
      >
        <template #header>
          <div
            class="table-header flex flex-column md:flex-row md:justify-content-between"
          >
            <h3 class="mb-2 md:m-0 p-as-md-center">Manage Race Texts</h3>
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText
                v-model="filters['global'].value"
                placeholder="Search..."
              />
            </span>
          </div>
        </template>

        <Column
          field="updatedAt"
          header="Date"
          :sortable="true"
          :style="{ 'min-width': '10rem', 'align-items': 'center' }"
        ></Column>

        <Column
          field="title"
          header="Title"
          :sortable="true"
          style="min-width: 12rem"
        ></Column>

        <Column
          field="text"
          header="Text"
          :sortable="true"
          style="max-width: 40rem"
        ></Column>

        <Column :exportable="false" style="min-width: 10rem">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-success mr-2"
              @click="editText(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-warning"
              :style="{ 'margin-left': '10px' }"
              @click="confirmDeleteText(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="textDialog"
      :style="{ width: '450px' }"
      header="Text Details"
      :modal="true"
      class="p-fluid"
    >
      <div class="field">
        <label for="title">Title</label>
        <InputText
          id="title"
          v-model.trim="text.title"
          :style="{ margin: '8px 0 15px' }"
          placeholder="Enter Title"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !text.title }"
        />
        <small class="p-error" v-if="submitted && !text.title"
          >Title is required.</small
        >
      </div>

      <div class="field">
        <label for="text" :style="{ margin: '10px' }"> Text</label>
        <Textarea
          id="text"
          v-model="text.text"
          :autoResize="true"
          :style="{ margin: '8px 0 15px' }"
          placeholder="Enter Text"
        />
      </div>

      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-text"
          @click="hideDialog"
        />
        <Button
          label="Save"
          icon="pi pi-check"
          class="p-button-text"
          @click="saveText"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteTextDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="text"
          >Are you sure you want to delete <b>{{ text.title }}</b
          >?</span
        >
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          class="p-button-text"
          @click="deleteTextDialog = false"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          class="p-button-text"
          @click="deleteText"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import { FilterMatchMode } from "primevue/api";
import { useToast } from "primevue/usetoast";
import axios from "axios";

const url = inject("backendURL");

onMounted(async () => {
  let allTexts = await getTexts();

  texts.value = await allTexts.data;
});

const toast = useToast();
const dt = ref();
const texts = ref();
const textDialog = ref(false);
const deleteTextDialog = ref(false);
const text = ref({});

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const submitted = ref(false);

const getTexts = async () => {
  try {
    let allTexts = await axios.get(`${url}/text/all`, {
      headers: {
        authorization: `bearer ${localStorage.getItem("token")}`,
      },
    });

    return allTexts.data;
  } catch (err) {
    return;
  }
};

const openNew = () => {
  text.value = {};
  submitted.value = false;
  textDialog.value = true;
};

const hideDialog = () => {
  textDialog.value = false;
  submitted.value = false;
};

const saveText = async () => {
  submitted.value = true;
  let { title, text: textVal, _id } = text.value;
  if (title.trim() !== "" || text.trim() !== "") {
    if (_id) {
      try {
        let res = await axios.patch(
          `${url}/text/edit/${_id}`,
          {
            title,
            text: textVal,
          },
          {
            headers: {
              authorization: `bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        res = res.data;
        if (res.status == "success") {
          toast.add({
            severity: "success",
            summary: "Updating Text",
            detail: "Text Updated Successfully.",
            life: 3000,
          });
          for (let i = 0; i < texts.value.length; i++) {
            if (texts.value[i]._id == _id) {
              texts.value[i].title = title;
              texts.value[i].text = textVal;
              break;
            }
          }
        } else {
          toast.add({
            severity: "warn",
            summary: "Updating Text",
            detail:
              "Something went wrong while updating Text info, try again after some time.",
            life: 3000,
          });
        }
      } catch (err) {
        toast.add({
          severity: "warn",
          summary: "Updating Text",
          detail:
            "Something went wrong while updating Text info, try again after some time.",
          life: 3000,
        });
      }
    } else {
      try {
        let res = await axios.post(
          `${url}/text/add`,
          {
            title,
            text: textVal,
          },
          {
            headers: {
              authorization: `bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        res = res.data;
        if (res.status == "success") {
          toast.add({
            severity: "success",
            summary: "Adding Text",
            detail: "Text Added Successfully.",
            life: 3000,
          });
          texts.value.push(res.newText);
        } else {
          toast.add({
            severity: "warn",
            summary: "Adding Text",
            detail:
              "Something went wrong while Adding Text info, try again after some time.",
            life: 3000,
          });
        }
      } catch (err) {
        toast.add({
          severity: "warn",
          summary: "Adding Text",
          detail:
            "Something went wrong while Adding Text info, try again after some time.",
          life: 3000,
        });
      }
    }

    textDialog.value = false;
    text.value = {};
  }
};

const editText = (prod) => {
  text.value = { ...prod };
  textDialog.value = true;
};

const confirmDeleteText = (prod) => {
  text.value = { ...prod };
  deleteTextDialog.value = true;
};

const deleteText = async () => {
  let { _id } = text.value;

  text.value = {};
  try {
    let res = await axios.delete(`${url}/text/delete/${_id}`, {
      headers: {
        authorization: `bearer ${localStorage.getItem("token")}`,
      },
    });
    res = res.data;
    if (res.status == "success") {
      toast.add({
        severity: "success",
        summary: "Deleting Text",
        detail: "Text Deleted Successfully.",
        life: 3000,
      });
      let idx;
      for (let i = 0; i < texts.value.length; i++) {
        if (texts.value[i]._id == _id) {
          idx = i;
          break;
        }
      }
      texts.value.splice(idx, 1);
    } else {
      toast.add({
        severity: "warn",
        summary: "Deleting Text",
        detail:
          "Something went wrong while Deleting Text info, try again after some time.",
        life: 3000,
      });
    }
  } catch (err) {
    toast.add({
      severity: "warn",
      summary: "Deleting Text",
      detail:
        "Something went wrong while Deleting Text info, try again after some time.",
      life: 3000,
    });
  }
  deleteTextDialog.value = false;
};
</script>

<style scoped>
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media screen and (max-width: 960px) {
    align-items: start;
  }
}

.text-image {
  width: 50px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.p-dialog .text-image {
  width: 50px;
  margin: 0 auto 2rem auto;
  display: block;
}

.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
}
@media screen and (max-width: 960px) {
  ::v-deep(.p-toolbar) {
    flex-wrap: wrap;
  }
  .p-button {
    margin-bottom: 0.25rem;
  }
}
</style>
