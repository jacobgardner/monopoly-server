Linting Manifesto
=================

Why do we lint?  Why do we care?  The purpose of coding standards and linters is pretty simple.
We want all code to look the same, or in the words of Douglas Crockford,

> We want to eventually be writing with one voice. We want all of the software that we develop
> on a project to look as though it was written by the same person, and that person is really
> smart and really talented. We want everything to look like that. We don't want anybody dumbing
> it down.

If we all write code the same, then we can look at our own code or someone else's code and don't
have to spend effort in parsing a new style of code because all code looks as if you wrote it.

Reasons For Specific Instances of Linting
=========================================

JavaScript being a language that largely evaluates at runtime makes some errors only appear
during runtime.  If we follow our coding standards strictly, though, our linter can prevent us
from writing error-inducing code.

 - Always start classes with a capital letter and always start variables with a lowercase letter.
 Always make variables that do not change (constants) in all caps.
    - If the linter sees a lowercase word with `new` before it being called or an uppercased word
    without `new`, then the linter can tell us that we're probably not using that class or
    function properly.
 - `if`/`else`/`return`/`function`/etc have a space after them
    - These are keywords, not functions, and so they behave differently.  Because of that, we
    want to make it clear that they behave differently by making them appear differently.
 - Dangling commas on multiline arrays/objects.
    - This is really just to make diffs cleaner.  If you're not touching the content on the line,
    then the line won't highlight in a diff.
 - Enforced semicolons
    - Optional semicolons in javascript introduced to make javascript easier to approach for devs.
    This was probably the single biggest mistake of the javascript programming language.  This
    is because dealing with multi-line statements, chaining functions, etc. often need semi-colons
    to work properly or to just semantically understand where a chain ends.
 - No `++/--`
    - These things are just confusing as fuck.  `++i++` increments i, returns that value, then
    increments i again.  It's not always clear what a developer intended to do and thus can lead
    to bugs.

