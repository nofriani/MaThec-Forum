import { create } from "zustand";

const useTagStore = create((set) => ({
  questions: [],
  data: [],
  isLoading: false,
  isLogin: false,
  row: 10,
  countPage: 1,
  page: 1,
  fetchData: async () => {
    set({
      isLoading: true,
      row: 10,
      countPage: 1,
      page: 1,
    });
    try {
      const response = await fetch(
        process.env.REACT_APP_API_HOST + "/api/home/tag_populer"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const json = await response.json();
      setTimeout(() => {
        set((state) => ({
          data: json.data,
          isLoading: false,
          countPage: Math.ceil(json.data.length / state.row),
        }));
      }, 500);
    } catch (error) {
      console.error("Error fetching data:", error);
      set({
        isLoading: false,
      });
    }
  },
  filterData: async (keyword) => {
    set({
      isLoading: true,
    });
    const response = await fetch(
      `${process.env.REACT_APP_API_HOST}/api/home/${keyword}`
    );
    const json = await response.json();

    setTimeout(() => {
      set({
        isLoading: false,
        data: json.data,
      });
    }, 500);
  },
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
  getQuestionByTag: async (name) => {
    set({
      isLoading: true,
    });
    const allData = await fetch(
      process.env.REACT_APP_API_HOST + "/api/tag/" + name
    );
    if (!allData.ok) {
      throw new Error("Network response was not ok");
    }
    const jsonConverted = await allData.json();
    setTimeout(() => {
      set((state) => ({
        questions: jsonConverted.data,
        isLoading: false,
        countPage: Math.ceil(jsonConverted.data.length / state.row),
      }));
    }, 500);
  },
  onLike: async (question, name) => {
    const user = JSON.parse(localStorage.getItem("user"));
    set({
      loadingLike: true,
      actionId: question.question_id,
    });
    const liked = await fetch(
      process.env.REACT_APP_API_HOST + "/api/questions/like",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.data.token}`,
        },
        body: JSON.stringify({
          question_id: question.question_id,
          user_id: user.data.user_id,
        }),
      }
    );
    const json = await liked.json();
    if (json.success) {
      const allData = await fetch(
        process.env.REACT_APP_API_HOST + "/api/tag/" + name
      );
      if (!allData.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonConverted = await allData.json();
      set({
        questions: jsonConverted.data,
        loadingLike: false,
        actionId: null,
      });
    }
  },
  onDislike: async (question, name) => {
    const user = JSON.parse(localStorage.getItem("user"));
    set({
      loadingDislike: true,
      actionId: question.question_id,
    });
    const liked = await fetch(
      process.env.REACT_APP_API_HOST + "/api/questions/dislike",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.data.token}`,
        },
        body: JSON.stringify({
          question_id: question.question_id,
          user_id: user.data.user_id,
        }),
      }
    );
    const json = await liked.json();
    if (json.success) {
      const allData = await fetch(
        process.env.REACT_APP_API_HOST + "/api/tag/" + name
      );
      if (!allData.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonConverted = await allData.json();
      set({
        questions: jsonConverted.data,
        loadingLike: false,
        actionId: null,
      });
    }
  },
  onSaved: async (question, name) => {
    const user = JSON.parse(localStorage.getItem("user"));
    set({
      loadingSaved: true,
      actionId: question.question_id,
    });
    const saved = await fetch(
      process.env.REACT_APP_API_HOST + "/api/questions/saved",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.data.token}`,
        },
        body: JSON.stringify({
          question_id: question.question_id,
          user_id: user.data.user_id,
        }),
      }
    );
    const json = await saved.json();
    if (json.success) {
      const allData = await fetch(
        process.env.REACT_APP_API_HOST + "/api/tag/" + name
      );
      if (!allData.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonConverted = await allData.json();
      set({
        questions: jsonConverted.data,
        loadingLike: false,
        actionId: null,
      });
    }
  },
}));

export default useTagStore;
