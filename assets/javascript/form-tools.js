/*
 * Form validation specifically for OctoberCMS
 */

$(window).on('ajaxInvalidField', function(event, fieldElement, fieldName, errorMsg, isFirst) {
    event.preventDefault()

    var $field = fieldElement.closest('.field'),
        $label = $('<div />').addClass('ui red pointing above ui label')

    if (errorMsg)
        $label.text(errorMsg.join(', '))

    $label.addClass('form-field-error-label')
    $field.addClass('error')


    // Prevent the next error alert only once
    $(window).one('ajaxErrorMessage', function(event, message){
        event.preventDefault()
    })

    if ($('.form-field-error-label', $field).length > 0)
        return

    $field.append($label)

    // Scroll to the form group
    if (isFirst) {
        $('html, body').animate({ scrollTop: $field.offset().top }, 500, function(){
            fieldElement.focus()
        })

        $label.transition({
            animation: 'shake',
            duration: '1s'
        })
    }
})

$(document).on('ajaxPromise', '[data-request]', function() {
    var $form = $(this).closest('form'),
        $label = $('.form-field-error-label', $form)

    if (!$form.length || !$label.length)
        return

    $label.remove()
    $('.field.error', $form).removeClass('error')
})


/*
 * Loading
 *
 * Examples:

<a data-request="onSomething" data-attach-loading>
    I will have loading class added
</a>

<form data-request="onSomething">
    <button data-attach-loading>I will have loading class added</button>
</form>

 */

$(document)
    .on('ajaxPromise', '[data-request]', function() {
        var $target = $(this)

        if ($target.data('attach-loading') !== undefined)
            $target.addClass('loading').prop('disabled', true)

        if ($target.is('form'))
            $('[data-attach-loading]', $target).addClass('loading')

    })
    .on('ajaxFail ajaxDone', '[data-request]', function() {
        var $target = $(this)

        if ($target.data('attach-loading') !== undefined)
            $target.removeClass('loading').prop('disabled', false)

        if ($target.is('form'))
            $('[data-attach-loading]', $target).removeClass('loading')

    })