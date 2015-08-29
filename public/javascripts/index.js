// Initializes page with most recent blog entries on page load
Blogs.getBlogs().done(function(results) {
    Blogs.renderBlogs(results);
});

// Infinity Scroll -- Event handler to watch for user scroll,
// then load next 10 blog entries from the API call
$(window).scroll(function() {

    // Gets dimensions of window and document and sets point to trigger scroll
    var wintop = $(window).scrollTop(), docheight = $(document).height(), winheight = $(window).height();
    var  scrolltrigger = 0.95;

    // If user scrolls to 95% of page, they have reached the end of the page,
    // and there are no AJAX requests that haven't completed and rendered,
    // it will execute the code
    if ((wintop/(docheight-winheight)) > scrolltrigger && Blogs.endOfPage === false && Blogs.requesting === false) {

        // Gets date of the last item rendered to page
        var lastItem = $('#lastPostsLoader .blog-post:last-child').attr('id');

        // When true, does not allow any other AJAX requests to be fired off
        // until complete
        Blogs.requesting = true;

        // When promise is returned from AJAX call, first checks to see that
        // result empty array. If so, it sets endOfPage to true and disables
        // further AJAX requests. Then it checks if it is not currently at
        // endOfPage and, if not, it renders HTML from JSON result.
        Blogs.getBlogs(lastItem).done(function(result){
            if (result.length === 0) {
                $('#lastPostsLoader').append('<div class="blog-post end-content">End Of Content</div>');
                Blogs.endOfPage = true;
            }
            if (Blogs.endOfPage !== true && result[0] !== undefined) {
                Blogs.renderBlogs(result)
                Blogs.requesting = false;
            } else if (Blogs.endOfPage !== true && result[0] === undefined) {
                console.log(result.message);
                $('#lastPostsLoader').append('<div class="blog-post error-message">Something has gone wrong. Try refreshing the page and please send email to colinalford@gmail.com.</div>');
                Blogs.requesting = false;
                Blogs.endOfPage = true;
            }
        })
        .error(function(result){
            console.log("you are a failure");
            console.log(result);
        });
    }
});
