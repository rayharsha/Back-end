const titleErrorMessage = "Title must be required and minimum of 10 characters and maximun of 100 characters.";
const subjectErrorMessage = "Subject must be required and minimum of 50 characters and maximun of 300 characters.";
const descriptionErrorMessage = "Description must be required and minimum of 200 characters and maximun of 300 characters.";
const SOMETHING_WENT_WRONG = "Something went wrong.";
const EMAIL_VALIDATION_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_VALIDATION_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

module.exports = {
    titleErrorMessage,
    subjectErrorMessage,
    descriptionErrorMessage,
    SOMETHING_WENT_WRONG,
    EMAIL_VALIDATION_REGEX,
    PASSWORD_VALIDATION_REGEX
};
