<?php
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
 * Restore task for local_aigrade plugin
 *
 * @package    local_aigrade
 * @copyright  2025 Brian A. Pool, National Trail Local Schools
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot . '/backup/moodle2/restore_local_plugin.class.php');

/**
 * Restore plugin class for local_aigrade
 */
class restore_local_aigrade_plugin extends restore_local_plugin {

    /**
     * Define the structure for restoring the plugin data
     *
     * @return array of restore_path_element
     */
    protected function define_module_plugin_structure() {
        
        $paths = [];
        
        // Define the path for the aigrade config element.
        $paths[] = new restore_path_element('local_aigrade_config', 
            $this->get_pathfor('/aigrade_config'));
        
        return $paths;
    }
    
    /**
     * Process the aigrade config element
     *
     * @param array $data The data from the backup file
     */
    public function process_local_aigrade_config($data) {
        global $DB;
        
        $data = (object)$data;
        $oldid = $data->id;
        
        // Get the new assignment ID (it will be different after restore).
        $newassignmentid = $this->task->get_activityid();
        $data->assignmentid = $newassignmentid;
        
        // Check if config already exists for this assignment (shouldn't happen, but be safe).
        $existing = $DB->get_record('local_aigrade_config', ['assignmentid' => $newassignmentid]);
        
        if ($existing) {
            // Update existing record.
            $data->id = $existing->id;
            $data->timemodified = time();
            $DB->update_record('local_aigrade_config', $data);
        } else {
            // Insert new record.
            unset($data->id);
            $data->timecreated = time();
            $data->timemodified = time();
            $DB->insert_record('local_aigrade_config', $data);
        }
        
        // Note: Rubric files are not restored.
        // Teachers will need to re-upload rubric files after restore if needed.
    }
}
