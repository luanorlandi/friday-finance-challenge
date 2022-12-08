import { render, screen } from "@testing-library/vue";
import BaseIcon from "./BaseIcon.vue";

describe("BaseIcon", () => {
  test("renders icon", async () => {
    render(BaseIcon, {
      props: {
        type: "Search",
      },
    });

    const imageElement = screen.getByAltText("Search");

    expect(imageElement).toBeVisible();
    expect(imageElement.nodeName).toBe("IMG");
  });
});
