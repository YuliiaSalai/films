import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilmForm from "pages/FilmsPage/components/FilmForm";
import films from "test/films";
import { AppProviders } from "contexts";

function setValuesToControlls(override = {}) {
  const { title, img, description, director, duration, price, featured } = {
    ...mockFilm,
    ...override,
  };

  userEvent.type(screen.getByLabelText(/title/i), title);
  userEvent.type(screen.getByLabelText(/image/i), img);
  userEvent.type(screen.getByLabelText(/description/i), description);
  userEvent.type(screen.getByLabelText(/director/i), director);
  userEvent.type(screen.getByLabelText(/duration/i), duration.toString());
  userEvent.type(screen.getByLabelText(/price/i), price.toString());
  userEvent.type(screen.getByLabelText(/featured/i), featured);
}

const mockFilm = films[0];
const mockSaveFilm = jest.fn();

jest.mock("contexts/FilmContext", () => ({
  ...jest.requireActual("contexts/FilmContext"),
  useStateFilms: () => mockFilm,
  useSaveFilm: () => mockSaveFilm,
}));

const mockUserState = { token: "12345", role: "admin" };
jest.mock("contexts/UserContext", () => ({
  ...jest.requireActual("contexts/UserContext"),
  useUserState: () => mockUserState,
}));

const mockHistory = { push: jest.fn() };

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => mockHistory,
}));

test("FilmForm should render correct", async () => {
  mockSaveFilm.mockImplementation(() => Promise.resolve(mockFilm));

  render(<FilmForm />, { wrapper: AppProviders });

  setValuesToControlls();
  const btnEl = screen.getByText(/save/i);

  userEvent.click(btnEl);
  expect(mockSaveFilm).toHaveBeenCalledTimes(1);
});

test("form should not has class loading while server errors", async () => {
  const titleError = "title has error";
  const resolvedValue = { response: { data: { errors: {} } } };
  resolvedValue.response.data.errors = { title: titleError };

  mockSaveFilm.mockImplementation(() => Promise.reject(resolvedValue));

  render(<FilmForm />, { wrapper: AppProviders });

  setValuesToControlls();

  const btnEl = screen.getByText(/save/i);
  const form = screen.getByTestId("film-form");

  await waitFor(() => userEvent.click(btnEl));

  expect(form).not.toHaveClass("loading");

  const messageErr = screen.queryByRole("alert");
  expect(messageErr).toBeInTheDocument();
  expect(messageErr).toHaveTextContent(titleError);
});

test("should render FormMessage when error", () => {
  mockSaveFilm.mockImplementation(() => Promise.resolve(mockFilm));
  render(<FilmForm />, { wrapper: AppProviders });

  setValuesToControlls({ title: null });

  const btnEl = screen.getByText(/save/i);

  userEvent.click(btnEl);
  const formMsg = screen.getByRole("alert");
  expect(formMsg).toBeInTheDocument();
});
