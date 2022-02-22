export const pipe =
    (...funcs) =>
    (previousResult) => {
        return funcs.reduce((res, func) => {
            return func(res);
        }, previousResult);
    };
