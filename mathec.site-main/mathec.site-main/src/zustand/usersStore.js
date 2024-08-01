import { create } from "zustand";

const useUserStore = create((set) => ({
  data: [],
  dataLogin: {},
  isLoading: false,
  error: null,
  userinfo: {},
  row: 10,
  countPage: 1,
  page: 1,
  setPage: (page) => {
    set({
      page: page,
    });
  },
  setCountPage: (count) => {
    set((state) => ({
      row: count,
      countPage: Math.ceil(state.data.length / count),
    }));
  },
  fetchDataUser: async () => {
    try {
      set({
        isLoading: true,
      });
      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/api/users/all`
      );
      const responseJson = await response.json();
      setTimeout(() => {
        set({
          data: responseJson.data,
          isLoading: false,
        });
      }, 500);
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },
  filterData: async (keyword) => {
    try {
      set({
        isLoading: true,
      });
      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/api/users/${keyword}`
      );
      const json = await response.json();
      setTimeout(() => {
        set({
          data: json.data,
          isLoading: false,
        });
      }, 1000);
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },
  userinfoById: async (id) => {
    try {
      set({
        isLoading: true,
      });
      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/api/users/userinfo/${id}`
      );
      const json = await response.json();
      setTimeout(() => {
        set({
          userinfo: json.data,
          isLoading: false,
        });
      }, 500);
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },
  userProfile: async () => {
    try {
      set({
        isLoading: true,
      });
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/api/users/userinfo/${user.data.user_id}`
      );
      const json = await response.json();
      setTimeout(() => {
        set({
          userinfo: json.data,
          isLoading: false,
        });
      }, 500);
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },
  updateUser: async (formData) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      set({
        isLoading: true,
      });

      const edit = await fetch(
        `${process.env.REACT_APP_API_HOST}/api/users/${user.data.user_id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const editJson = await edit.json();

      if (editJson.error) {
        throw new Error(editJson.error);
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/api/users/userinfo/${user.data.user_id}`
      );
      const json = await response.json();

      user.data.profile_picture = json.data.Profile.profile_picture;
      user.data.email = json.data.email;
      user.data.name = json.data.name;

      localStorage.setItem("user", JSON.stringify(user));

      setTimeout(() => {
        set({
          userinfo: json.data,
          isLoading: false,
          error: null,
        });
      }, 500);
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },
  handleDelete: async (id) => {
    set({
      isLoading: true,
    });
    const user = JSON.parse(localStorage.getItem("user"));
    await fetch(process.env.REACT_APP_API_HOST + "/api/questions/delete/" + id);

    const response = await fetch(
      process.env.REACT_APP_API_HOST +
        `/api/users/userinfo/${user.data.user_id}`
    );
    const json = await response.json();

    setTimeout(() => {
      set({
        userinfo: json.data,
        isLoading: false,
        error: null,
      });
    }, 500);
  },

  handleDeleteAnswer: async (id) => {
    try {
      set({
        isLoading: true,
      });
      const user = JSON.parse(localStorage.getItem("user"));
      await fetch(
        process.env.REACT_APP_API_HOST + "/api/questions/answer/" + id,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );

      const response = await fetch(
        process.env.REACT_APP_API_HOST +
          `/api/users/userinfo/${user.data.user_id}`
      );
      const json = await response.json();

      setTimeout(() => {
        set({
          userinfo: json.data,
          isLoading: false,
          error: null,
        });
      }, 500);
    } catch (error) {
      set({
        isLoading: false,
        error: error,
      });
    }
  },
}));

export default useUserStore;
