const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const eslint = require('gulp-eslint');


function swallow(error) {
    console.error(error.toString());

    this.emit('end');
}

const SOURCE_FILES = ['src/**/*.js'];

gulp.task('lint', () => {
    return gulp.src(SOURCE_FILES)
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('js', ['lint'], () => {
    return gulp.src(SOURCE_FILES)
        .pipe(sourcemaps.init())
            .pipe(babel())
            .on('error', swallow)
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['js'], () => {
    gulp.watch('src/**/*.js', ['js']);
});

gulp.task('default', ['js']);
