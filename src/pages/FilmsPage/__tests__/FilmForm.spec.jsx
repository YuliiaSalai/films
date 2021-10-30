import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilmForm from "pages/FilmsPage/components/FilmForm";
import films from "test/films";
import {QueryClient, QueryClientProvider} from 'react-query';
import { queryConfig } from 'contexts';
import {UserContextProvider} from 'contexts/UserContext';
import {MemoryRouter as Router} from 'react-router-dom'
import * as funcs from 'hooks/films';

function wrapper({children}){
  const queryClient = new QueryClient(queryConfig);
  return <Router>
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        {children}
      </UserContextProvider>
    </QueryClientProvider>
  </Router>
}

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
  jest.spyOn(funcs, 'useEditFilm').mockImplementation(() => mockFilm)
  jest.spyOn(funcs, 'useSaveFilm').mockImplementation(() => ({
    mutate: mockSaveFilm
  }))

  render(<FilmForm />, { wrapper });

  setValuesToControlls();
  const btnEl = screen.getByText(/save/i);

  userEvent.click(btnEl);
  expect(mockSaveFilm).toHaveBeenCalledTimes(1);
});

test("should render FormMessage when error", () => {
  jest.spyOn(funcs, 'useEditFilm').mockImplementation(()=>({_id: null}))
  render(<FilmForm />, { wrapper });

  setValuesToControlls({ title: null });

  const btnEl = screen.getByText(/save/i);

  userEvent.click(btnEl);
  const formMsg = screen.getByRole("alert");
  expect(formMsg).toBeInTheDocument();
});
