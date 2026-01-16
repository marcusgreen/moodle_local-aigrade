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
 * AMD module for AI Grade bulk grading button
 *
 * @module     local_aigrade/grade_bulk
 * @copyright  2025 Brian A. Pool, National Trail Local Schools
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

define(['jquery', 'core/ajax', 'core/notification', 'core/str'], function($, Ajax, Notification, Str) {

    return {
        /**
         * Initialize the grade bulk button
         * @param {string} buttonUrl The URL for the AJAX request
         * @param {string} buttonText The text to display on the button
         * @param {string} sesskey The session key
         */
        init: function(buttonUrl, buttonText, sesskey) {
            $(document).ready(function() {
                if ($('.aigrade-button-injected').length > 0) {
                    return;
                }

                var button = $('<button>')
                    .attr('type', 'button')
                    .addClass('btn btn-primary aigrade-button-injected')
                    .text(buttonText)
                    .on('click', function() {
                        var btn = $(this);
                        var originalText = btn.text();

                        Str.get_string('confirm_bulk_grade', 'local_aigrade').done(function(confirmMsg) {
                            if (!confirm(confirmMsg)) {
                                return;
                            }

                            btn.prop('disabled', true).text('Grading all submissions...');

                            $.ajax({
                                url: buttonUrl + '&action=grade&sesskey=' + sesskey,
                                method: 'POST',
                                dataType: 'json',
                                success: function(response) {
                                    if (response.success) {
                                        Notification.addNotification({
                                            message: 'Successfully graded ' + response.count + ' submission(s).',
                                            type: 'success'
                                        });
                                        window.location.reload();
                                    } else {
                                        Notification.addNotification({
                                            message: 'Error: ' + (response.error || 'Unknown error occurred'),
                                            type: 'error'
                                        });
                                        btn.prop('disabled', false).text(originalText);
                                    }
                                },
                                error: function(xhr, status, error) {
                                    Notification.addNotification({
                                        message: 'Error communicating with server: ' + error,
                                        type: 'error'
                                    });
                                    btn.prop('disabled', false).text(originalText);
                                }
                            });
                        }).fail(function() {
                            // Fallback if string fetch fails
                            if (!confirm('Grade all ungraded submissions with AI? This may take a few moments.')) {
                                return;
                            }

                            btn.prop('disabled', true).text('Grading all submissions...');

                            $.ajax({
                                url: buttonUrl + '&action=grade&sesskey=' + sesskey,
                                method: 'POST',
                                dataType: 'json',
                                success: function(response) {
                                    if (response.success) {
                                        alert('Successfully graded ' + response.count + ' submission(s).');
                                        window.location.reload();
                                    } else {
                                        alert('Error: ' + (response.error || 'Unknown error occurred'));
                                        btn.prop('disabled', false).text(originalText);
                                    }
                                },
                                error: function(xhr, status, error) {
                                    alert('Error communicating with server: ' + error);
                                    btn.prop('disabled', false).text(originalText);
                                }
                            });
                        });
                    });

                if ($('.tertiary-navigation').length) {
                    $('.tertiary-navigation').first().prepend($('<div>').css('display', 'inline-block').append(button));
                } else if ($('#page-header').length) {
                    $('#page-header').first().after($('<div>').addClass('alert alert-info').css('margin', '15px').append(button));
                } else {
                    $('#page-content').prepend($('<div>').addClass('alert alert-info').css('margin', '15px').append(button));
                }
            });
        }
    };
});
