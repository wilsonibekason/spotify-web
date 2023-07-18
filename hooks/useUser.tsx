import { Subscription, UserDetail_Sp } from "@/types";
import { User } from "@supabase/auth-helpers-react";
import { createContext, useContext, useEffect, useState } from "react";
import {
  useSessionContext,
  useUser as useSupaUser,
} from "@supabase/auth-helpers-react";

type userContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetail_Sp | null;
  subscription: Subscription | null;
  isLoading: boolean;
};

export const UserContext = createContext<userContextType | undefined>(
  undefined
);

export interface Props {
  [propName: string]: any;
}

export const MyUserContextProvider = (props: Props) => {
  const {
    isLoading: isLoadingUser,
    session: supabaseSession,
    supabaseClient: supabase,
  } = useSessionContext();
  const user = useSupaUser();
  const accessToken = supabaseSession?.access_token ?? null;
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<UserDetail_Sp | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const getUserDetails = () => supabase.from("users").select("*").single();
  const getSubscription = () =>
    supabase
      .from("subscriptions")
      .select("*, prices(*, products(*))")
      .in("status", ["trailing, active"])
      .single();

  useEffect(() => {
    if (user && !isLoadingData && !userDetails && !subscription) {
      setIsLoadingData(true);

      Promise.allSettled([getUserDetails(), getSubscription()]).then(
        (results) => {
          const userDetailPromise = results[0];
          const subscriptionPromise = results[1];

          if (userDetailPromise.status == "fulfilled") {
            setUserDetails(userDetailPromise.value.data as UserDetail_Sp);
          }
          if (subscriptionPromise.status == "fulfilled") {
            setSubscription(subscriptionPromise.value.data as Subscription);
          }
        }
      );
    } else if (!user && !isLoadingData && !isLoadingUser) {
      setIsLoadingData(false);
      setSubscription(null);
      setUserDetails(null);
    }
  }, [user, isLoadingUser]);

  const value = {
    isLoading: isLoadingData || isLoadingUser,
    user,
    accessToken,
    userDetails,
    subscription,
  };
  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context == undefined) {
    throw Error("UseUser cannot be used out side UserContextProvider");
  }
  return context;
};
