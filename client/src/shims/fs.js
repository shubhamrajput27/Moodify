const notSupported = () => {
  throw new Error('Node fs module is not available in the browser.');
};

export const promises = new Proxy(
  {},
  {
    get() {
      return notSupported;
    },
  }
);

const fsShim = new Proxy(
  {},
  {
    get() {
      return notSupported;
    },
  }
);

export default fsShim;