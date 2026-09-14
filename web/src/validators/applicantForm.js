import * as yup from "yup";

const NAME_PATTERN = /^[a-zA-Z][a-zA-Z\s'-]*$/;
const EMOJI_REGEX = /[\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/u;

const noEmoji = (schema) => schema.test("no-emoji", "Emojis are not allowed", (value) => !value || !EMOJI_REGEX.test(value));

export const applicantFormSchema = yup.object({
  firstName: noEmoji(
    yup.string().trim().min(2, "First name is too short").matches(NAME_PATTERN, "Enter a valid first name").required("First name is required")
  ),
  lastName: noEmoji(yup.string().trim().min(2, "Last name is too short").matches(NAME_PATTERN, "Enter a valid last name").required("Last name is required")),
  email: yup.string().trim().email("Enter a valid email").required("Email is required"),
  city: noEmoji(yup.string().trim().matches(NAME_PATTERN, "Enter a valid city").required("City is required")),
  state: noEmoji(yup.string().trim().matches(NAME_PATTERN, "Enter a valid state").required("State is required")),
  phone: yup
    .string()
    .trim()
    .matches(/^[+\d][\d\s-]{6,19}$/, "Enter a valid phone number")
    .required("Phone is required"),
  resume: yup.mixed().required("Resume is required")
});

export const applicantFormInitialValues = {
  firstName: "",
  lastName: "",
  email: "",
  city: "",
  state: "",
  phone: "",
  resume: null
};
