import type { Meta, StoryObj } from "@storybook/react";
import { GlassButton } from "../src/button";

const meta: Meta<typeof GlassButton> = {
  title: "Glass/Button",
  component: GlassButton,
  argTypes: {
    variant: { control: { type: "select" }, options: ["primary", "ghost", "danger"] },
    size: { control: { type: "select" }, options: ["sm", "md", "lg"] }
  }
};
export default meta;

type Story = StoryObj<typeof GlassButton>;

export const Primary: Story = { args: { children: "Continue" } };
export const Ghost: Story = { args: { children: "Learn more", variant: "ghost" } };
export const Danger: Story = { args: { children: "Delete", variant: "danger" } };