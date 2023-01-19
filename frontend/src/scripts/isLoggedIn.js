import axios from "axios";

async function isLoggedIn(url) {
  let token = localStorage.getItem("token");
  if (token) {
    try {
      let res = await axios.get(`${url}/user/profile`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      res = await res.data;
      console.log(res);
      if (res.status == "success") {
        return {
          status: true,
          name: res.name,
          role: res.role,
          userId: res.userId,
        };
      } else {
        return { status: false, msg: "not logged in" };
      }
    } catch (err) {
      console.log(err);
      return { status: false, msg: "not logged in" };
    }
  } else {
    return { status: false, msg: "not logged in" };
  }
}

export default isLoggedIn;
