// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * AMD module for AI Grade single submission button
 *
 * @module     local_aigrade/grade_single
 * @copyright  2025 Brian A. Pool, National Trail Local Schools
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

define(['jquery'], function($) {

    return {
        /**
         * Initialize the grade single button
         * @param {string} buttonUrl The URL for the AJAX request
         * @param {string} buttonText The text to display on the button
         * @param {string} sesskey The session key
         */
        init: function(buttonUrl, buttonText, sesskey) {
            var checkCount = 0;
            var maxChecks = 20;

            var insertButton = function() {
                checkCount++;

                if ($('.aigrade-single-button').length > 0) {
                    return true;
                }

                var hasFeedback = $('div[id*="fitem_id_assignfeedbackcomments"]').length > 0;

                if (!hasFeedback && checkCount < maxChecks) {
                    return false;
                }

                var button = $('<button>')
                    .attr('type', 'button')
                    .addClass('btn btn-primary aigrade-single-button')
                    .text(buttonText)
                    .on('click', function() {
                        var btn = $(this);
                        var originalText = btn.text();

                        btn.prop('disabled', true).text('Grading...');

                        $.ajax({
                            url: buttonUrl + '&action=grade&sesskey=' + sesskey,
                            method: 'POST',
                            dataType: 'json',
                            success: function(response) {
                                if (response.success) {
                                    window.location.reload();
                                } else {
                                    var errorMsg = response.error || 'Unknown error occurred';
                                    alert('Error: ' + errorMsg);
                                    btn.prop('disabled', false).text(originalText);
                                }
                            },
                            error: function(xhr, status, error) {
                                alert('Error communicating with server: ' + error);
                                btn.prop('disabled', false).text(originalText);
                            }
                        });
                    });

                var container = $('<div>')
                    .addClass('local_aigrade-button-container')
                    .append(button);

                var inserted = false;
                var gradeInput = $('input[name*="grade"]');
                var feedbackSection = $('div[id*="fitem_id_assignfeedbackcomments"]');

                if (feedbackSection.length) {
                    feedbackSection.before(container);
                    inserted = true;
                }

                if (!inserted && gradeInput.length) {
                    gradeInput.first().closest('.fitem, .form-group').before(container);
                    inserted = true;
                }

                if (!inserted && $('[data-region="grade-panel"]').length) {
                    $('[data-region="grade-panel"]').prepend(container);
                    inserted = true;
                }

                if (!inserted) {
                    var mainContent = $('#region-main-box, #region-main, [role="main"]').first();

                    if (mainContent.length) {
                        mainContent.prepend(container);
                        inserted = true;
                    }
                }

                return inserted;
            };

            var insertInterval = setInterval(function() {
                if (insertButton() || checkCount >= maxChecks) {
                    clearInterval(insertInterval);
                }
            }, 500);

            $(window).on('load', insertButton);

            $(document).ajaxComplete(function() {
                insertButton();
            });
        }
    };
});
