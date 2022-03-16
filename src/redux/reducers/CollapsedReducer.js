export const CollapsedReducer = (pre = {
    isCollapsed: true
}, action) => {
    let { type } = action
    switch (type) {
        case "cahnge_collapsed":
            let newsate = { ...pre }
            newsate.isCollapsed = !newsate.isCollapsed
            return newsate
        default:
            return pre
    }
}