# Changelog

All notable changes to the AI Grade plugin will be documented in this file.

## [1.4.0] - 2026-01-16

### Fixed
- Fixed `local_aigrade_coursemodule_standard_elements()` function signature to accept both `$formwrapper` and `$mform` parameters as required by Moodle 4.5+ hook system
- Removed duplicate header line in assignment settings form (line 64 in lib.php)
- Fixed backup and restore implementation for course backup/restore functionality
  - Simplified backup/restore to handle configuration only (rubric files must be re-uploaded after restore)
  - Resolved "unknown_context_mapping" errors during course restore
- Fixed settings.php double semicolon syntax error (line 124)

### Changed
- Updated Privacy API implementation from `null_provider` to full metadata provider
  - Plugin now properly declares that student submission content is sent to external AI providers
  - Added detailed privacy metadata strings explaining what data is processed externally
- Updated language strings to follow Moodle capitalization guidelines (sentence case instead of Title Case)
  - Changed strings like "AI Instructions" to "AI instructions"
  - Changed "Student Grade Level" to "Student grade level"
  - Updated all label strings to use sentence case
- Improved backup/restore documentation
  - Added comments explaining that rubric files are not backed up
  - Teachers must re-upload rubric files after course restore

### Technical
- Plugin now complies with Moodle.org submission requirements
- Proper frankenstyle naming throughout
- Security checks properly implemented (require_login, require_sesskey, require_capability)
- Settings stored in config_plugins table (not config table)
- All database operations use Moodle DML API with proper parameterization

## [1.3.0] - 2025-01-15

### Fixed
- Converted inline JavaScript to proper AMD modules for Moodle coding standards compliance
  - Created `amd/src/grade_single.js` for individual grading button
  - Created `amd/src/grade_bulk.js` for bulk grading button
  - Updated `lib.php` to use `js_call_amd()` instead of inline JavaScript
  - Added language string `confirm_bulk_grade` for better user experience
- Fixed duplicate headers in README.md (removed duplicate "Features" and "Support" sections)
- Created proper CSS file with namespaced selectors
  - Added `styles.css` with `.path-mod-assign` and `.local_aigrade-` prefixed classes
  - Removed inline CSS styles from JavaScript modules
  - Improved compliance with Moodle CSS guidelines
- Fixed error message display to use alert dialogs instead of top-page notifications

## [1.0.0] - 2025-01-12

### Added
- Initial release
- AI-powered assignment grading using Moodle core AI subsystem
- Support for multiple submission types:
  - Online text submissions
  - File uploads: PDF, DOCX, DOC, TXT, PPTX, PPT, ODT
  - Google Docs links (via export API)
  - Google Slides links (via export API)
- Support for rubric-based grading (PDF, DOCX, DOC, TXT formats)
- Dual prompt system (separate instructions for with/without rubric)
- Grade level awareness (grades 3-12)
- Customizable AI assistant name
- Individual and bulk grading capabilities
- Integration with Moodle assignment module
- Privacy API implementation (GDPR compliant)
- Configurable site-wide default instructions
- Per-assignment instruction customization
- Dynamic grade scaling (respects assignment point values)
- Teacher review and override capabilities
- AJAX-based grading interface
- Automatic feedback cleanup and formatting

### Features
- Seamless integration with Moodle's assignment grading interface
- Encourages constructive, grade-appropriate feedback
- File-based rubric upload and text extraction
- Real-time button display on grading pages

### Technical
- Moodle 4.5+ compatibility
- PHP 7.4+ compatibility
- Database table: local_aigrade_config
- Proper upgrade path handling
- Language string externalization
- Coding standards compliance
