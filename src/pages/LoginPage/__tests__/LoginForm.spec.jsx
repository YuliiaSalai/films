import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter as Router } from "react-router-dom";
import LoginForm from "pages/LoginPage/components/LoginForm";
import { build, fake, oneOf } from "@jackfranklin/test-data-bot";

const buildFormData = build({
  fields: {
    email: oneOf("u1@com.ua", "u2@com.ua"),
    password: fake((f) => f.internet.password()),
  },
});

test("LoginForm should render correct", () => {
  render(
    <Router>
      <LoginForm />
    </Router>
  );
  const { email, password } = buildFormData();

  const emailEl = screen.getByLabelText(/email/i);
  const passwordEl = screen.getByLabelText(/password/i);

  userEvent.type(emailEl, email);
  userEvent.type(passwordEl, password);

  expect(emailEl).toHaveValue(email);
  expect(passwordEl).toHaveValue(password);

  const formMsg = screen.queryByRole("alert");
  expect(formMsg).toBeNull();
});

test("should invoke handleSubmit", () => {
  const submit = jest.fn(() => Promise.resolve());
  render(
    <Router>
      <LoginForm submit={submit} />
    </Router>
  );
  const { email, password } = buildFormData();

  const emailEl = screen.getByLabelText(/email/i);
  const passwordEl = screen.getByLabelText(/password/i);
  const btn = screen.getByText(/login/i);

  userEvent.type(emailEl, email);
  userEvent.type(passwordEl, password);
  userEvent.click(btn);

  expect(submit).toHaveBeenCalledTimes(1);
  expect(submit).toHaveBeenCalledWith({ email, password });

  const form = screen.getByTestId("login-form");
  expect(form).toHaveClass("loading");
});

test("should show errors message", () => {
  const submit = jest.fn(() => Promise.resolve());
  render(
    <Router>
      <LoginForm submit={submit} />
    </Router>
  );
  const { email, password } = buildFormData({
    map: (data) => {
      data.email = "nocorrect";
      return data;
    },
  });

  const emailEl = screen.getByLabelText(/email/i);
  const passwordEl = screen.getByLabelText(/password/i);
  const btn = screen.getByText(/login/i);

  userEvent.type(emailEl, email);
  userEvent.type(passwordEl, password);
  userEvent.click(btn);

  const formMsg = screen.getByRole("alert");
  expect(formMsg).not.toBeEmptyDOMElement();

  const form = screen.getByTestId("login-form");
  expect(form).not.toHaveClass("loading");
});
