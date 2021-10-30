import React from "react";
import { Route, Redirect } from "react-router-dom";
import _find from "lodash/find";
import { useUserState } from "contexts/UserContext";

const AdminRoute = ({ children, path, ...rest }) => {
  const user = useUserState();
  const isAdmin = user.token && user.role === "admin";

  if (!isAdmin) return <Redirect to="/films" />;

  const RenderComponent = ({ match }) => {
    const _id = match.params._id || null;
    return React.cloneElement(children, {
      film: _find(children.props.films, { _id }) || {},
      ...children.props,
    });
  };

  return <Route path={path} render={RenderComponent} {...rest} />;
};

export default AdminRoute;
