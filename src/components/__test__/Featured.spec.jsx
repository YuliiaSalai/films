import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Featured from "components/Featured";
import * as funcs from 'hooks/films';

import { AppProviders } from "contexts";

const propsData = { film: { _id: "1", featured: true } };

const wrapper = ({children}) => 
<AppProviders>
{children}
</AppProviders>

test("should correct render", async () => {
  const mockToggleFeatured = jest.fn();
  jest.spyOn(funcs, 'useToggleFeatured').mockImplementation(()=>({
    mutate: mockToggleFeatured
  }));
  const { rerender, container } = render(<Featured {...propsData} />, {wrapper});

  const spanEl = container.querySelector("span");
  const iconEl = container.querySelector("i");

  expect(iconEl).toHaveClass("yellow");
  expect(iconEl).not.toHaveClass("empty");

  await waitFor(() => userEvent.click(spanEl));

  expect(mockToggleFeatured).toHaveBeenCalledTimes(1);
  expect(mockToggleFeatured).toHaveBeenCalledWith({...propsData.film, featured: false});

  propsData.film.featured = false;
  rerender(<Featured {...propsData} />);

  expect(iconEl).toHaveClass("empty");
  expect(iconEl).not.toHaveClass("yellow");
});
