import { createContext, useReducer, useEffect } from "react";
import reducers from "./Reducers";
import { getData } from "../utils/fetchData";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const initialState = {
    notify: {},
    auth: {},
    cart: [],
    wishlist: [],
    modal: [],
    orders: [],
    users: [],
    categories: [],
  };

  const [state, dispatch] = useReducer(reducers, initialState);
  const { wishlist, cart, auth } = state;

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      getData("auth/accessToken").then((res) => {
        if (res.err) return localStorage.removeItem("firstLogin");
        dispatch({
          type: "AUTH",
          payload: {
            token: res.access_token,
            user: res.user,
          },
        });
      });
    }

    getData("categories").then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });

      dispatch({
        type: "ADD_CATEGORIES",
        payload: res.categories,
      });
    });
  }, []);

  useEffect(() => {
    const cartitems = JSON.parse(localStorage.getItem("cartitems"));

    if (cartitems) dispatch({ type: "ADD_CART", payload: cartitems });
  }, []);

  useEffect(() => {
    localStorage.setItem("cartitems", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const wishlistitems = JSON.parse(localStorage.getItem("wishlistitems"));

    if (wishlistitems)
      dispatch({ type: "ADD_WISHLIST", payload: wishlistitems });
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlistitems", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (auth.token) {
      getData("order", auth.token).then((res) => {
        if (res.err)
          return dispatch({ type: "NOTIFY", payload: { error: res.err } });

        dispatch({ type: "ADD_ORDERS", payload: res.orders });
      });

      if (auth.user.role === "admin") {
        getData("user", auth.token).then((res) => {
          if (res.err)
            return dispatch({ type: "NOTIFY", payload: { error: res.err } });

          dispatch({ type: "ADD_USERS", payload: res.users });
        });
      }
    } else {
      dispatch({ type: "ADD_ORDERS", payload: [] });
      dispatch({ type: "ADD_USERS", payload: [] });
    }
  }, [auth.token]);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};
