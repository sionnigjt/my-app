export const LoadingReducer = (pre = {
    isLoading: false
}, action) => {
    let { type, payLoading } = action
    switch (type) {
        case "change_loading":
            let newsate = { ...pre }
            newsate.isLoading = payLoading
            return newsate
        default:
            return pre
    }
}