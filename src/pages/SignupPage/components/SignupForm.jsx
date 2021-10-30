import { useState } from "react";
import { Link } from "react-router-dom";
import isEmail from "validator/lib/isEmail";
import equals from "validator/lib/equals";
import FormMessage from "components/FormMessage";
import setFormObj, {setFormErr} from "components/FormUtils";

const initialData = {
  email: "",
  password: "",
  passwordConfirmation: "",
};

const SignupForm = (props) => {

  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const validate = (data) => {
    const errors = {};
    if (!isEmail(data.email)) errors.email = "Email is wrong";
    if (!data.password) errors.password = "Password cannot be blank";
    if (!data.passwordConfirmation)
      errors.passwordConfirmation = "Password confirmation cannot be blank";
    if (!equals(data.password, data.passwordConfirmation))
      errors.passwordConfirmation = "Password is not equals to password confirmation";
    return errors;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate(data);
    setErrors(errors);
    if (Object.keys(errors).length === 0) {
      setLoading(true);
      props
        .submit(data)
        .catch((error) =>{
          setErrors(error.response.data.errors);
          setLoading(false);
        });
    }
  };

    const cls = loading ? "ui form loading" : "ui form";
    return (
      <form className={cls} onSubmit={handleSubmit} data-testid='signup-form'>
        <div className={errors.email ? "error field" : "field"}>
          <label htmlFor="email">Email</label>
          <input
            value={data.email}
            onChange={setFormObj(data, setData)}
            onInput={setFormErr(errors, setErrors)}
            type="text"
            name="email"
            id="email"
            placeholder="Email"
          />
          {errors.email && <FormMessage>{errors.email}</FormMessage>}
        </div>

        <div className={errors.password ? "error field" : "field"}>
          <label htmlFor="password">Password</label>
          <input
            value={data.password}
            onChange={setFormObj(data, setData)}
            onInput={setFormErr(errors, setErrors)}
            type="text"
            name="password"
            id="password"
            placeholder="password"
          />
          {errors.password && <FormMessage>{errors.password}</FormMessage>}
        </div>

        <div className={errors.passwordConfirmation ? "error field" : "field"}>
          <label htmlFor="passwordConfirmation">Password Confirmation</label>
          <input
            value={data.passwordConfirmation}
            onChange={setFormObj(data, setData)}
            onInput={setFormErr(errors, setErrors)}
            type="text"
            name="passwordConfirmation"
            id="passwordConfirmation"
            placeholder="password confirmation"
          />
          {errors.passwordConfirmation && (
            <FormMessage>{errors.passwordConfirmation}</FormMessage>
          )}
        </div>

        <div className="ui fluid buttons">
          <button className="ui button primary">Sing Up</button>
          <div className="or" />
          <Link to="/" className="ui button">
            Cancel
          </Link>
        </div>
      </form>
    );
  }

export default SignupForm;
