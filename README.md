Errors encountered:

1. Joi 'ValidationError':
    It was because I was sending 'user' as an Object value when 'user' is by itself already an Object.
    I was doing: 

    ```
    Joi.validate( {user}, UserValidator, (err) => {
    ```
    when it should be:
    ```
    Joi.validate( user, UserValidator, (err) => {
    ```