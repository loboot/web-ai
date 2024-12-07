import api from '../index';

export default {
  queryActiveCodeCheck: () => api.get('active-code/check'),
  activateCode: (activeCode: string) =>
    api.post('active-code/activate', { activeCode }),
};
