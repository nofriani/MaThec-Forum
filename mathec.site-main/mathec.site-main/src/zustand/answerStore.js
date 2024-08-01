import { create } from 'zustand';

const useAnswerStore = create(set => ({
  isLoading: false,
  dataQuestion: {},
  dataAnswer: null,
  dateQuestionEdit: null,
  error: null,
  loadingAnswer: false,
  fetchDataQuestion: async id => {
    try {
      set({
        isLoading: true,
      });
      // const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(process.env.REACT_APP_API_HOST + '/api/questions/detail/' + id + '/long', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const json = await response.json();
      set({
        isLoading: false,
        dataQuestion: json.data,
      });
    } catch (error) {
      set({
        error: error,
        isLoading: false,
      });
    }
  },
  fetchDataAnswer: async id => {
    try {
      set({
        isLoading: true,
      });
      const response = await fetch(process.env.REACT_APP_API_HOST + '/api/questions/answer/' + id);
      const json = await response.json();

      const question = await fetch(process.env.REACT_APP_API_HOST + '/api/questions/detail/' + json.data.question_id + '/long', {
        method: 'POST',
      });
      const questionJson = await question.json();
      setTimeout(() => {
        set({
          dataAnswer: json.data,
          dataQuestion: questionJson.data,
          isLoading: false,
        });
      }, 500);
    } catch (error) {
      set({
        error: error,
        isLoading: false,
      });
    }
  },
  filterDataAnswer: async (id, keyword) => {
    try {
      set({
        isLoading: true,
      });
      const response = await fetch(process.env.REACT_APP_API_HOST + '/api/questions/detail/' + id + '/' + keyword, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const json = await response.json();
      setTimeout(() => {
        set({
          isLoading: false,
          dataQuestion: json.data,
        });
      }, 500);
    } catch (error) {
      set({
        error: error,
        isLoading: false,
      });
    }
  },

  fetchEdit: async id => {
    try {
      set({
        isLoading: true,
      });
      // const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(process.env.REACT_APP_API_HOST + '/api/questions/detail/' + id + '/all', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const json = await response.json();
      set({
        isLoading: false,
        dateQuestionEdit: json.data,
      });
    } catch (error) {
      set({
        error: error,
        isLoading: false,
      });
    }
  },
  updateAnswer: async (id, body) => {
    try {
      set({
        loadingAnswer: true,
      });
      const answer = {
        body,
      };
      const user = JSON.parse(localStorage.getItem('user'));
      await fetch(process.env.REACT_APP_API_HOST + '/api/questions/answer/' + id, {
        method: 'PUT',
        body: JSON.stringify(answer),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.data.token}`,
        },
      });
      setTimeout(() => {
        set({
          loadingAnswer: false,
        });
      }, 500);
    } catch (error) {
      set({
        loadingAnswer: false,
      });
    }
  },

  postAnswer: async (id, body) => {
    set({
      loadingAnswer: true,
    });
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      const question = {
        body,
        user_id: user.data.user_id,
        question_id: id,
      };
      const response = await fetch(process.env.REACT_APP_API_HOST + '/api/questions/answer', {
        method: 'POST',
        body: JSON.stringify(question),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.data.token}`,
        },
      });
      const json = await response.json();
      if (json.success) {
        const response = await fetch(process.env.REACT_APP_API_HOST + '/api/questions/detail/' + id + '/all', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const json = await response.json();
        set({
          loadingAnswer: false,
          dataQuestion: json.data,
        });
      } else {
        set({
          loadingAnswer: false,
        });
      }
    }
  },

  likeAnswer: async (id, idParams, state) => {
    const user = JSON.parse(localStorage.getItem('user'));

    try {
      if (user) {
        const response = await fetch(process.env.REACT_APP_API_HOST + '/api/questions/answer-like', {
          method: 'POST',
          body: JSON.stringify({
            user_id: parseInt(user.data.user_id),
            answer_id: id,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await fetch(process.env.REACT_APP_API_HOST + '/api/questions/detail/' + idParams + '/' + state, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const resultConvert = await result.json();

        set({
          dataQuestion: resultConvert.data,
        });
      }
    } catch (error) {
      set({
        error: error,
      });
    }
  },
  dislikeAnswer: async (id, idParams, state) => {
    const user = JSON.parse(localStorage.getItem('user'));

    try {
      if (user) {
        const response = await fetch(process.env.REACT_APP_API_HOST + '/api/questions/answer-dislike', {
          method: 'POST',
          body: JSON.stringify({
            user_id: parseInt(user.data.user_id),
            answer_id: id,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const json = await response.json();
        console.log(`/${state}`, json.success);

        const result = await fetch(process.env.REACT_APP_API_HOST + '/api/questions/detail/' + idParams + `/${state}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const resultConvert = await result.json();

        set({
          dataQuestion: resultConvert.data,
        });
      }
    } catch (error) {
      set({
        error: error,
      });
    }
  },
  clearAnswer: () => {
    set({
      dataAnswer: null,
    });
  },
}));

export default useAnswerStore;
