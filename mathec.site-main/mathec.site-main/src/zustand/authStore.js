import { create } from 'zustand';

const useAuthStore = create((set) => ({
  dataLogin: {},
  isLogin: false,
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('expiredToken');
    set({
      isLogin: false,
    });
  },
  checkLogin: () => {
    let user = JSON.parse(localStorage.getItem('user'));
    if (user == null) {
      set({
        isLogin: false,
      });
      return null;
    } else {
      let exp = user.data.exp;
      if (exp === undefined) {
        set({
          isLogin: false,
        });
        return;
      }
      const expired = exp < Math.floor(Date.now() / 1000);
      if (expired) {
        localStorage.removeItem('user');
        set({
          isLogin: false,
          dataLogin: {},
        });
      } else {
        set({
          isLogin: true,
        });
        return user;
      }
    }
  },
  getInfoLogin: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      set({
        dataLogin: user.data,
      });
    } else {
      set({
        isLogin: false,
        dataLogin: {},
      });
    }
  },
}));

export default useAuthStore;
