// src/utils/localStorageHelper.js

const LOCAL_STORAGE_KEY = 'userProfile';

export const saveUserToLocal = (userData) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving to local storage:', error);
  }
};

export const getUserFromLocal = () => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving from local storage:', error);
    return null;
  }
};

export const clearUserFromLocal = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
};
