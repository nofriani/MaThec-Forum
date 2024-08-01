import { create } from 'zustand';

const useSaveStore = create(set => ({
  data: null,
  actionId: null,
  isLoading: false,
  loadingLike: false,
  loadingDislike: false,
  loadingSaved: false,
  error: null,
  row: 10,
  countPage: 1,
  page: 1,
  setPage: page => {
    set({
      page: page,
    });
  },
  setCountPage: count => {
    set(state => ({
      row: count,
      countPage: Math.ceil(state.data.length / count),
    }));
  },
  fetchSave: async () => {
    try {
      set({
        isLoading: true,
      });
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(process.env.REACT_APP_API_HOST + '/api/save/' + user.data.user_id + '/all');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const json = await response.json();
      set(state => ({
        data: json.data,
        isLoading: false,
        countPage: Math.ceil(json.data.length / state.row),
      }));
    } catch (error) {
      set({
        error: error,
        isLoading: false,
      });
    }
  },
  filterData: async keyword => {
    try {
      set({
        isLoading: true,
      });
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(process.env.REACT_APP_API_HOST + '/api/save/' + user.data.user_id + '/' + keyword);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const json = await response.json();
      set({
        data: json.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error,
        isLoading: false,
      });
    }
  },
  onLike: async question => {
    const user = JSON.parse(localStorage.getItem('user'));
    set({
      loadingLike: true,
      actionId: question.question_id,
    });
    const liked = await fetch(process.env.REACT_APP_API_HOST + '/api/questions/like', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.data.token}`,
      },
      body: JSON.stringify({
        question_id: question.question_id,
        user_id: user.data.user_id,
      }),
    });
    const json = await liked.json();
    if (json.success) {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(process.env.REACT_APP_API_HOST + '/api/save/' + user.data.user_id + '/all');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const json = await response.json();
      set({
        data: json.data,
        loadingLike: false,
        actionId: null,
      });
    }
    set({
      loadingLike: false,
      actionId: null,
    });
  },
  onDislike: async question => {
    const user = JSON.parse(localStorage.getItem('user'));
    set({
      loadingDislike: true,
      actionId: question.question_id,
    });
    const liked = await fetch(process.env.REACT_APP_API_HOST + '/api/questions/dislike', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.data.token}`,
      },
      body: JSON.stringify({
        question_id: question.question_id,
        user_id: user.data.user_id,
      }),
    });
    const json = await liked.json();
    if (json.success) {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(process.env.REACT_APP_API_HOST + '/api/save/' + user.data.user_id + '/all');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const json = await response.json();
      set({
        data: json.data,
        loadingLike: false,
        actionId: null,
      });
    }
    set({
      loadingLike: false,
      actionId: null,
    });
  },
  onSaved: async question => {
    const user = JSON.parse(localStorage.getItem('user'));
    set({
      loadingSaved: true,
      actionId: question.question_id,
    });
    const saved = await fetch(process.env.REACT_APP_API_HOST + '/api/questions/saved', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.data.token}`,
      },
      body: JSON.stringify({
        question_id: question.question_id,
        user_id: user.data.user_id,
      }),
    });
    const json = await saved.json();
    if (json.success) {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(process.env.REACT_APP_API_HOST + '/api/save/' + user.data.user_id + '/all');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const json = await response.json();
      set({
        data: json.data,
        loadingLike: false,
        actionId: null,
      });
    }
    set({
      loadingLike: false,
      actionId: null,
    });
  },
}));

export default useSaveStore;
