import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, Mock } from "vitest";
import { NumberInput } from "./NumberInput";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
describe("NumberInput", () => {
  const ControlledInput = (props: { value: number; onChange: Mock }) => {
    const [value, setValue] = useState(props.value);

    return (
      <NumberInput
        icon="£"
        placeholder="GBP"
        type="decimal"
        id="test"
        label="Test"
        max={999}
        value={value}
        onChange={(v) => {
          setValue(v);
          props.onChange(v);
        }}
      />
    );
  };
  it("renders the label correctly", () => {
    render(<ControlledInput onChange={vi.fn()} value={123} />);
    expect(screen.getByLabelText("Test")).toBeInTheDocument();
  });

  it("renders the initial value correctly", () => {
    render(<ControlledInput onChange={vi.fn()} value={123} />);
    expect(screen.getByDisplayValue("123")).toBeInTheDocument();
  });

  it("calls onChange with the correct value when input changes", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<ControlledInput onChange={handleChange} value={55} />);

    const input = screen.getByRole("textbox");
    // clear the input
    await user.click(input);
    await user.keyboard("{Backspace}{Backspace}");

    // enter new value
    await user.type(input, "1.56");

    expect(handleChange).toHaveBeenLastCalledWith(1.56);
  });

  it("if user is typing an incomplete number, the last valid number is called instead", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<ControlledInput onChange={handleChange} value={15} />);
    const input = screen.getByRole("textbox");

    await user.click(input);
    await user.keyboard(".");

    expect(handleChange).toHaveBeenCalledWith(15);
  });

  it("user is allowed to type decimal numbers", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<ControlledInput onChange={handleChange} value={0} />);
    const input = screen.getByRole("textbox");

    await user.click(input);
    await user.keyboard("{Backspace}");
    await user.type(input, "45.875");

    expect(handleChange).toHaveBeenLastCalledWith(45.875);
  });

  it("if user clears the input box, on change is called with 0 instead", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<ControlledInput onChange={handleChange} value={10} />);
    const input = screen.getByRole("textbox");

    await user.click(input);
    await user.keyboard("{Backspace}{Backspace}");

    expect(handleChange).toHaveBeenCalledWith(0);
  });

  describe("invalid input values", () => {
    it.each([
      "q",
      "w",
      "e",
      "r",
      "t",
      "y",
      "u",
      "i",
      "o",
      "p",
      "a",
      "s",
      "d",
      "f",
      "g",
      "h",
      "j",
      "k",
      "l",
      "z",
      "x",
      "c",
      "v",
      "b",
      "n",
      "m",
      "<",
      ">",
      "/",
      "?",
      "[[",
      "]",
      "{{",
      "}",
      ";",
      "'",
      "#",
      ":",
      "@",
      "~",
      "-",
      "_",
      "+",
      "=",
      "!",
      '"',
      "£",
      "$",
      "%",
      "^",
      "&",
      "*",
      "(",
      ")",
      "_",
      "+",
      "\\",
    ])("prevents non-allowed keys from being entered", async (char) => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<ControlledInput onChange={handleChange} value={0} />);
      const input = screen.getByRole("textbox");

      await user.click(input);
      await user.keyboard(char);
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  it("sets value to max if input exceeds max", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<ControlledInput onChange={handleChange} value={100} />);
    const input = screen.getByLabelText("Test");
    // would bring value to 1000 (with max = 999)
    await user.type(input, "1");
    expect(handleChange).toHaveBeenCalledWith(999);
    expect(input).toHaveValue("999");
  });
});
