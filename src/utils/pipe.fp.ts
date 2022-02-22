export const pipe =
    (...funcs) =>
    (result) => {
        return funcs.reduce((res, func) => {
            return func(res);
        }, result);
    };
