import { render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter as Router } from "react-router-dom";
import SignupForm from 'pages/SignupPage/components/SignupForm'
import { build, fake } from "@jackfranklin/test-data-bot";

const buildFormData = build({
    fields: {
        email: fake(f => f.internet.email()),
        password: fake(f => f.internet.password())
    }
})

test('should render and submit correct', () => {
    const submit = jest.fn(()=>Promise.resolve());
    render(<SignupForm submit={submit}/>, {wrapper: Router})

    const {email, password} = buildFormData();

    const emailEl = screen.getByLabelText(/email/i);
    const passwordEl = screen.getByLabelText(/password$/i);
    const confPassEl = screen.getByLabelText(/password confirmation/i);
    const btn = screen.getByText(/sing up/i);

    userEvent.type(emailEl, email);
    userEvent.type(passwordEl, password);
    userEvent.type(confPassEl, password);

    expect(emailEl).toHaveValue(email);
    expect(passwordEl).toHaveValue(password);
    expect(confPassEl).toHaveValue(password);

    userEvent.click(btn);

    expect(submit).toHaveBeenCalledTimes(1);
    expect(submit).toHaveBeenCalledWith({email, password, passwordConfirmation: password});

    const formMsg = screen.queryByRole("alert");
    expect(formMsg).toBeNull();

    const form = screen.getByTestId('signup-form');
    expect(form).toHaveClass('loading');
})

test('should show error if field is blank', () => {
    const submit = jest.fn(()=>Promise.resolve());
    render(<SignupForm submit={submit}/>, {wrapper: Router})

    const {email, password} = buildFormData({
        map: (data) => {
          data.email = "";
          return data;
        },
      });

    const emailEl = screen.getByLabelText(/email/i);
    const passwordEl = screen.getByLabelText(/password$/i);
    const confPassEl = screen.getByLabelText(/password confirmation/i);
    const btn = screen.getByText(/sing up/i);

    userEvent.type(emailEl, email);
    userEvent.type(passwordEl, password);
    userEvent.type(confPassEl, password);

    userEvent.click(btn);

    expect(submit).toHaveBeenCalledTimes(0);

    const form = screen.getByTestId('signup-form');
    expect(form).not.toHaveClass('loading');

    const formMsg = screen.getByRole("alert");
    expect(formMsg).toBeInTheDocument();
})

test('should show error if passwordConfirm is wrong', () => {
    const submit = jest.fn(()=>Promise.resolve());
    render(<SignupForm submit={submit}/>, {wrapper: Router});

    const {email, password} = buildFormData();

    const emailEl = screen.getByLabelText(/email/i);
    const passwordEl = screen.getByLabelText(/password$/i);
    const confPassEl = screen.getByLabelText(/password confirmation/i);
    const btn = screen.getByText(/sing up/i);

    userEvent.type(emailEl, email);
    userEvent.type(passwordEl, password);
    userEvent.type(confPassEl, '123');

    userEvent.click(btn);

    expect(submit).toHaveBeenCalledTimes(0);

    const form = screen.getByTestId('signup-form');
    expect(form).not.toHaveClass('loading');

    const formMsg = screen.getByRole("alert");
    expect(formMsg).toBeInTheDocument();
    expect(formMsg).toHaveTextContent("Password is not equals to password confirmation");
})

test('should show errors from server', async() => {
    const emailError = 'User with such email already exists'
    const serverError = {
        response: {
            data: {
                errors: {
                    email: emailError
                }
            }
        }
    }

    const submit = jest.fn().mockRejectedValue(serverError)
    render(<SignupForm submit={submit}/>, {wrapper: Router});

    const {email, password} = buildFormData();

    const emailEl = screen.getByLabelText(/email/i);
    const passwordEl = screen.getByLabelText(/password$/i);
    const confPassEl = screen.getByLabelText(/password confirmation/i);
    const btn = screen.getByText(/sing up/i);

    userEvent.type(emailEl, email);
    userEvent.type(passwordEl, password);
    userEvent.type(confPassEl, password);

    await waitFor(() => userEvent.click(btn));

    expect(submit).toHaveBeenCalledTimes(1);

    const form = screen.getByTestId('signup-form');
    expect(form).not.toHaveClass('loading');

    const formMsg = screen.getByRole("alert");
    expect(formMsg).toBeInTheDocument();
    expect(formMsg).toHaveTextContent(emailError);
})



