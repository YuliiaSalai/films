import { useState, lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import TopNavigation from "components/TopNavigation";
import HomePage from "pages/HomePage";
import { FullSpinner } from "styles/app";
import { useUserState } from "contexts/UserContext";

const FilmsPage = lazy(() => import("pages/FilmsPage"));
const SignupPage = lazy(() => import("pages/SignupPage"));
const LoginPage = lazy(() => import("pages/LoginPage"));
const FilmDetails = lazy(() =>
  import("pages/FilmsPage/components/FilmDetails")
);

const App = () => {
  const user = useUserState();

  return (
    <Suspense fallback={<FullSpinner />}>
      <div className="ui container">
        <TopNavigation />
        
        <Route exact path="/">
          <HomePage />
        </Route>

        <Route path="/films">
          <FilmsPage user={user} />
        </Route>
        <Route path="/film/:id">
          <FilmDetails />
        </Route>

        <Route path="/signup">
          <SignupPage/>
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
      </div>
    </Suspense>
  );
};

export default App;
