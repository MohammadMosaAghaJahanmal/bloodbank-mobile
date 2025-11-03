// contexts/AuthContext.js  (React Native)
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import useStore from '../store/store';
import serverPath from '../utils/serverPath';

const A_TOKEN = 'A_TOKEN';

const initialState = {
  login: false,
  token: null,
  user: null,
  role: null,
  loading: false,
};

export const AuthContext = React.createContext({
  ...initialState,
  initialState,
  setAuth: (prev) => {},
});

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text(); // tolerate empty body
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (e) {
    // ignore JSON parse error; will fall back to status checks
  }
  if (!res.ok) {
    const msg = (json && (json.message || json.error)) || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return json;
}

const AuthProvider = (props) => {
  const dispatch = useStore(false)[1];
  const [auth, setAuth] = useState({ ...initialState });

  // validate token on mount
  useEffect(() => {
    let isMounted = true;

    (async () => {
      const authtoken = await AsyncStorage.getItem(A_TOKEN);
      if (!authtoken) return;

      if (!isMounted) return;
      setAuth((prev) => ({ ...prev, loading: true }));

      try {
        const objData = await fetchJSON(serverPath('/api/auth/token'), {
          method: 'POST',
          headers: { Authorization: `bearer ${authtoken}` },
        });

        if (objData && objData.status === 'failure') {
          Alert.alert('Error', objData.message || 'Token validation failed');
          await AsyncStorage.removeItem(A_TOKEN);
          if (!isMounted) return;
          setAuth((p) => ({ ...p, loading: false }));
          return;
        }

        if (!isMounted) return;
        setAuth((prev) => ({
          ...prev,
          login: true,
          loading: false,
          token: authtoken,
          user: objData?.user || null,
          role: objData?.user?.role || null,
        }));
      } catch (err) {
        await AsyncStorage.removeItem(A_TOKEN);
        if (isMounted) setAuth((p) => ({ ...p, loading: false }));
      }
    })();

    return () => { isMounted = false; };
  }, []);


  // (Optional) helpers you can call from screens
 const saveTokenAndLogin = useCallback(async (token, user) => {
   await AsyncStorage.setItem(A_TOKEN, token);
   // (optional) persist user if you like:
   // await AsyncStorage.setItem('A_USER', JSON.stringify(user));
   setAuth((p) => ({
     ...p,
     login: true,
     token,
     user: user || null,
     role: user?.role || null,
   }));
 }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(A_TOKEN);
    setAuth({ ...initialState });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        initialState,
        setAuth,
        saveTokenAndLogin, // optional helper
        logout,            // optional helper
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
