<template>
  <div>
    <div class="card">
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
            <h3 class="mb-2 md:m-0 p-as-md-center">Manage Users</h3>
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
          field="name"
          header="Name"
          :sortable="true"
          style="min-width: 12rem"
        ></Column>

        <Column
          field="email"
          header="Email"
          :sortable="true"
          style="max-width: 12rem"
        ></Column>
        <Column
          field="speed"
          header="Speed"
          :sortable="true"
          style="max-width: 12rem"
        ></Column>
        <Column
          field="totalRaces"
          header="Total Races"
          :sortable="true"
          style="max-width: 12rem"
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
        <label for="name">Name</label>
        <InputText
          id="name"
          v-model.trim="text.name"
          :style="{ margin: '8px 0 15px' }"
          placeholder="Enter Name"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !text.name }"
        />
        <small class="p-error" v-if="submitted && !text.name"
          >Title is required.</small
        >
      </div>

      <div class="field">
        <label for="email" :style="{ margin: '10px' }"> Email</label>
        <InputText
          id="email"
          v-model="text.email"
          :style="{ margin: '8px 0 15px' }"
          placeholder="Enter Text"
          required="true"
          :class="{ 'p-invalid': submitted && !text.email }"
        />
      </div>

      <div class="field">
        <label for="speed" :style="{ margin: '10px' }"> Speed</label>
        <InputText
          id="speed"
          v-model="text.speed"
          disabled
          :style="{ margin: '8px 0 15px' }"
          placeholder="Enter Text"
        />
      </div>
      <div class="field">
        <label for="totalRaces" :style="{ margin: '10px' }"> Total Races</label>
        <InputText
          id="totalRaces"
          v-model="text.totalRaces"
          disabled
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
  let allPlayers = await getPlayers();

  texts.value = await allPlayers.users;
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

const getPlayers = async () => {
  try {
    let allPlayers = await axios.get(`${url}/user/allplayers`, {
      headers: {
        authorization: `bearer ${localStorage.getItem("token")}`,
      },
    });

    return allPlayers.data;
  } catch (err) {
    console.log(err);
  }
};

const hideDialog = () => {
  textDialog.value = false;
  submitted.value = false;
};

const saveText = async () => {
  submitted.value = true;
  let { name, email: emailVal, _id } = text.value;
  if (name.trim() !== "" && emailVal.trim() !== "") {
    if (_id) {
      try {
        let res = await axios.patch(
          `${url}/user/edit/${_id}`,
          {
            name,
            email: emailVal,
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
            summary: "Updating Player",
            detail: "Player Updated Successfully.",
            life: 3000,
          });
          for (let i = 0; i < texts.value.length; i++) {
            if (texts.value[i]._id == _id) {
              console.log(texts.value);
              texts.value[i].name = name;
              texts.value[i].email = emailVal;
              break;
            }
          }
        } else {
          toast.add({
            severity: "warn",
            summary: "Updating Player",
            detail:
              "Something went wrong while updating Player info, try again after some time.",
            life: 3000,
          });
        }
      } catch (err) {
        console.log(err);
        toast.add({
          severity: "warn",
          summary: "Updating Player",
          detail:
            "Something went wrong while updating Player info, try again after some time.",
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
    let res = await axios.delete(`${url}/user/delete/${_id}`, {
      headers: {
        authorization: `bearer ${localStorage.getItem("token")}`,
      },
    });
    res = res.data;
    if (res.status == "success") {
      toast.add({
        severity: "success",
        summary: "Deleting Player",
        detail: "Player Deleted Successfully.",
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
        summary: "Deleting Player",
        detail:
          "Something went wrong while Deleting Player info, try again after some time.",
        life: 3000,
      });
    }
  } catch (err) {
    toast.add({
      severity: "warn",
      summary: "Deleting Player",
      detail:
        "Something went wrong while Deleting Player info, try again after some time.",
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
