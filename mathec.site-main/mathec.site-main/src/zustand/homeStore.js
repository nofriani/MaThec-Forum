import { create } from 'zustand';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

const useHomeStore = create(set => ({
  data: [],
  actionId: null,
  isLoading: false,
  loadingLike: false,
  loadingDislike: false,
  loadingSaved: false,
  error: null,
  row: 10,
  countPage: 1,
  page: 1,
  fetchData: async () => {
    try {
      set({
        isLoading: true,
      });
      const response = await fetch(process.env.REACT_APP_API_HOST + '/api/home/all');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const json = await response.json();
      setTimeout(() => {
        set(state => ({
          data: json.data,
          isLoading: false,
          countPage: Math.ceil(json.data.length / state.row),
        }));
      }, 500);
    } catch (error) {
      set({
        error: error,
      });
    }
  },
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
  filterData: async keyword => {
    set({
      isLoading: true,
    });
    const response = await fetch(process.env.REACT_APP_API_HOST + `/api/home/${keyword}`);
    const json = await response.json();
    setTimeout(() => {
      set(state => ({
        data: json.data,
        isLoading: false,
        countPage: Math.ceil(json.data.length / state.row),
      }));
    }, 500);
  },
  onLike: async question => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
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
        const allData = await fetch(process.env.REACT_APP_API_HOST + '/api/home/all');
        if (!allData.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonConverted = await allData.json();
        set({
          data: jsonConverted.data,
          loadingLike: false,
          actionId: null,
        });
      }
    } else {
      Toastify({
        text: '❗Anda Tidak dapat melakukan like question sebelum login',
        position: 'center',
        className: 'info',
        style: {
          color: '#000000',
          background: '#f8d7da',
        },
      }).showToast();
    }
  },

  onDislike: async question => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
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
        const allData = await fetch(process.env.REACT_APP_API_HOST + '/api/home/all');
        if (!allData.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonConverted = await allData.json();
        set({
          data: jsonConverted.data,
          loadingDislike: false,
          actionId: null,
        });
      }
    } else {
      Toastify({
        text: '❗Anda Tidak dapat melakukan dislike question sebelum login',
        position: 'center',
        className: 'info',
        style: {
          color: '#000000',
          background: '#f8d7da',
        },
      }).showToast();
    }
  },
  onSaved: async question => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
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
        const allData = await fetch(process.env.REACT_APP_API_HOST + '/api/home/all');
        if (!allData.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonConverted = await allData.json();
        set({
          data: jsonConverted.data,
          loadingSaved: false,
          actionId: null,
        });
      }
    } else {
      Toastify({
        text: '❗Anda Tidak dapat melakukan saved question sebelum login',
        position: 'center',
        className: 'info',
        style: {
          color: '#000000',
          background: '#f8d7da',
        },
      }).showToast();
    }
  },
  filterMonth: async (from, to) => {
    set({
      isLoading: true,
    });
    const response = await fetch(process.env.REACT_APP_API_HOST + `/api/home/${from}/${to}`);
    const json = await response.json();
    setTimeout(() => {
      set(state => ({
        data: json.data,
        isLoading: false,
        countPage: Math.ceil(json.data.length / state.row),
      }));
    }, 500);
  },
}));

export default useHomeStore;
