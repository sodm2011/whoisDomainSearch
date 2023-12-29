export const validateDomain = (domain) => {
    const regex = /^(?!-)([A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/;
    return regex.test(domain);
  };
  
  export const updateCache = (domain, data) => {
    const newCache = {
      data: data,
      timestamp: new Date().getTime()
    };
    localStorage.setItem(domain, JSON.stringify(newCache));
  };
  
  export const checkCache = (domain) => {
    const cacheEntry = JSON.parse(localStorage.getItem(domain));
    if (cacheEntry && (new Date().getTime() - cacheEntry.timestamp) < 24 * 60 * 60 * 1000) {
      return cacheEntry.data;
    }
    return null;
  };
  