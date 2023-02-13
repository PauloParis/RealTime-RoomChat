import moment from "moment"

// formato mensaje
export const formatMessage = (username, text) => {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    }
}
