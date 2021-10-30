import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Featured from "components/Featured";

import { AppProviders } from "contexts";

const propsData = { film: { _id: "1", featured: true } };
const toggleFeatured = jest.fn();

const mockToggleFeatured = jest.fn();
jest.mock("contexts/FilmContext", () => ({
  ...jest.requireActual("contexts/FilmContext"),
  useToggleFeatured: () => mockToggleFeatured,
}));

const RenderComponent = (props) => {
  return (
    <AppProviders>
      <Featured {...props} />
    </AppProviders>
  );
};

test("should correct render", () => {
  const { rerender, container } = render(<RenderComponent {...propsData} />);

  const spanEl = container.querySelector("span");
  const iconEl = container.querySelector("i");

  expect(iconEl).toHaveClass("yellow");
  expect(iconEl).not.toHaveClass("empty");

  userEvent.click(spanEl);

  expect(mockToggleFeatured).toHaveBeenCalledTimes(1);
  expect(mockToggleFeatured).toHaveBeenCalledWith(propsData.film);

  propsData.film.featured = false;
  rerender(<RenderComponent {...propsData} />);

  expect(iconEl).toHaveClass("empty");
  expect(iconEl).not.toHaveClass("yellow");
});
