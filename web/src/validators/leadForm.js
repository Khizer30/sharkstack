import * as yup from "yup";

const EMOJI_REGEX = /[\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/u;

const noEmoji = (schema) => schema.test("no-emoji", "Emojis are not allowed", (value) => !value || !EMOJI_REGEX.test(value));

export const leadFormSchema = yup.object({
  name: noEmoji(
    yup
      .string()
      .trim()
      .min(2, "Name is too short")
      .matches(/^[a-zA-Z][a-zA-Z\s'-]*$/, "Enter a valid name")
      .required("Name is required")
  ),
  email: yup.string().trim().email("Enter a valid email").required("Email is required"),
  phone: yup
    .string()
    .trim()
    .matches(/^[+\d][\d\s-]{6,19}$/, "Enter a valid phone number")
    .required("Phone is required"),
  companyName: noEmoji(
    yup
      .string()
      .trim()
      .matches(/[a-zA-Z]/, { message: "Enter a valid company name", excludeEmptyString: true })
  ),
  companyLink: yup.string().trim().url("Enter a valid URL (https://...)").required("Company link is required"),
  region: noEmoji(
    yup
      .string()
      .trim()
      .matches(/^[a-zA-Z][a-zA-Z\s,]*$/, "Enter a valid region")
      .required("Region is required")
  ),
  services: yup.array().of(yup.string()).min(1, "Select at least one service"),
  projectDetails: noEmoji(yup.string().trim().min(10, "Tell us a bit more about your project").required("Project details are required"))
});

export const leadFormInitialValues = {
  name: "",
  email: "",
  phone: "",
  companyName: "",
  companyLink: "",
  region: "",
  services: [],
  projectDetails: ""
};
