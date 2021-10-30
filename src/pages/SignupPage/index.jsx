import { useHistory } from "react-router-dom";
import SignupForm from "pages/SignupPage/components/SignupForm";
import api from "api";
import { useToast } from "@chakra-ui/react";

const SignupPage = () => {
  const history = useHistory();
  const toast = useToast();

  const submit = (user) =>
    api.users.create(user).then(() => {
      toast({
        title: 'User has been created',
        status: "success",
        duration: 5000,
        isClosable: true,
    })
      history.push("/login");
    });

  return (
    <div className="ui grid">
      <div className="eight wide column">
        <SignupForm submit={submit} />
      </div>
    </div>
  );
};

export default SignupPage;

