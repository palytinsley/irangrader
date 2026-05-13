const CONFIG = {
  SPREADSHEET_ID: '1MFTI_d3d6JVbB8EUhJYbIcc2m68BDyv862hF7NpNKfc',
  WEB_APP_URL: 'https://script.google.com/a/macros/pausd.org/s/AKfycbwtgWnFWzLvq6DVgvFaBmeYqarN8V8NNuAmdhW5QYadpAgnZb1GcNgQHyxjFpsMEdKH/exec',
  SCRIPT_ID: '1DMPQB5PCjrRj1_-OMpoBR5GJPxipWjYFJ70LzP4iW8xuvSRsyj-RsgZM',
  TEST_EMAIL_RECIPIENT: 'ktinsley@pausd.org',
  ASSIGNMENT_TITLE: 'Iran Summative',
  COURSE_NAME: 'Contemporary World History',
  TOTAL_MAX: 20,
  PRIME_THRESHOLD_PCT: 90,
  CRIT_MAX: { claim: 4, evidence: 8, reasoning: 6, mechanics: 2 },
  SHEETS: {
    STUDENTS: 'Students',
    SETTINGS: 'Settings',
    LOG: 'Log'
  },
  STATUS: {
    UNGRADED: 'Ungraded',
    IN_PROGRESS: 'In Progress',
    COMPLETE: 'Complete',
    NO_SUBMISSION: 'No Submission'
  },
  PRIME_STATUS: {
    NEEDS: 'Needs PRIME',
    PRINTED: 'Printed',
    COMPLETED: 'Completed',
    NOT_NEEDED: 'Not Needed'
  },
  TEACHERS: {
    tinsley: { name: 'Mr. Tinsley', periods: ['3'] },
    castaneda: { name: 'Mr. Castaneda', periods: ['1', '2'] }
  },
  STUDENT_HEADERS: [
    'Student ID', 'Name', 'Sort Name', 'Period', 'Teacher', 'Email',
    'Essay', 'Claim Score', 'Evidence Score', 'Reasoning Score', 'Mechanics Score',
    'Total Score', 'Percent', 'Status', 'Flagged',
    'PRIME Eligible', 'PRIME Status', 'PRIME Comment', 'PRIME Focus Areas', 'PRIME Printed At',
    'Vocab Found', 'Vocab Missing',
    'Comment', 'Last Saved At', 'Last Saved By', 'Roster Loaded At', 'Essay Loaded At',
    'Last Viewed At'
  ],
  SETTINGS_DEFAULTS: {
    'Assignment Title': 'Iran Summative',
    'Course Name': 'Contemporary World History',
    'PRIME Comment Text': 'Come to PRIME to revise up to 90%.',
    'Visit Below Percent': '89',
    'Revise To Percent': '90'
  }
};

const RUBRIC = [
  {
    key: 'claim',
    title: 'Claim',
    max: 4,
    scoreHeader: 'Claim Score',
    bands: [
      { label: 'Full Credit', score: 4, text: 'Clear, arguable claim for each of the three questions that directly addresses the prompt.' },
      { label: 'Partial', score: 3, text: 'Claims present for most questions; at least one is vague or partially addresses the prompt.' },
      { label: 'Minimal', score: 2, text: 'Only one clear claim present; others are missing or are restatements of the question.' },
      { label: 'Missing', score: 0, text: 'No discernible claims across the three responses.' }
    ]
  },
  {
    key: 'evidence',
    title: 'Evidence',
    max: 8,
    scoreHeader: 'Evidence Score',
    bands: [
      { label: 'Full Credit', score: 8, text: 'Specific, accurate historical evidence across all three responses; all 6 vocabulary terms present.' },
      { label: 'Strong', score: 7, text: 'Mostly specific evidence; all vocab terms present but one response relies on generalities.' },
      { label: 'Approaching', score: 6, text: 'Some specific evidence; 1-2 vocabulary terms missing or evidence inconsistent across questions.' },
      { label: 'Developing', score: 4, text: 'Limited specific evidence; multiple vocabulary terms missing; responses rely heavily on generalities.' },
      { label: 'Insufficient', score: 2, text: 'Minimal or inaccurate evidence; most vocabulary terms absent.' },
      { label: 'Missing', score: 0, text: 'No evidence provided.' }
    ]
  },
  {
    key: 'reasoning',
    title: 'Reasoning',
    max: 6,
    scoreHeader: 'Reasoning Score',
    bands: [
      { label: 'Full Credit', score: 6, text: 'Analysis clearly connects evidence to claims across all three responses; demonstrates understanding of causation, significance, or change over time.' },
      { label: 'Partial', score: 5, text: 'Reasoning present in most responses; one response summarizes rather than analyzes.' },
      { label: 'Developing', score: 3, text: 'Reasoning is surface-level or present in only one response; evidence listed rather than explained.' },
      { label: 'Missing', score: 1, text: 'No analysis; responses are purely descriptive or list facts without explanation.' }
    ]
  },
  {
    key: 'mechanics',
    title: 'Mechanics',
    max: 2,
    scoreHeader: 'Mechanics Score',
    bands: [
      { label: 'Full Credit', score: 2, text: 'Writing is clear and organized; paragraph structure evident; errors do not impede meaning.' },
      { label: 'Partial', score: 1, text: 'Multiple errors or inconsistent paragraph structure that occasionally impedes meaning.' },
      { label: 'Missing', score: 0, text: 'Frequent errors that significantly impede readability; no paragraph structure.' }
    ]
  }
];

function doGet(e) {
  try {
    const action = stringOrBlank_(e && e.parameter && e.parameter.action);
    if (!action) return HtmlService.createHtmlOutput(buildStatusPage_()).setTitle('Iran Summative API');
    switch (action) {
      case 'getStudents':
        return jsonOutput_(getStudents_(e.parameter.teacherKey));
      case 'getStudentDetails':
        return jsonOutput_(getStudentDetails_(e.parameter.studentId, e.parameter.teacherKey));
      case 'getAnalytics':
        return jsonOutput_(getAnalytics_(e.parameter.teacherKey));
      default:
        return jsonOutput_({ ok: false, message: 'Unknown action: ' + action });
    }
  } catch (err) {
    logError_('doGet', err, { parameter: e && e.parameter });
    return jsonOutput_(errorResponse_(err));
  }
}

function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    switch (payload.action) {
      case 'uploadRoster':
        return jsonOutput_(uploadRoster_(payload));
      case 'uploadEssays':
        return jsonOutput_(uploadEssays_(payload));
      case 'saveGrade':
        return jsonOutput_(saveGrade_(payload));
      case 'savePrime':
        return jsonOutput_(savePrime_(payload));
      case 'markNoSubmission':
        return jsonOutput_(markNoSubmission_(payload));
      case 'markPrimePrinted':
        return jsonOutput_(markPrimePrinted_(payload));
      case 'saveRubric':
        return jsonOutput_(saveRubric_(payload));
      default:
        return jsonOutput_({ ok: false, message: 'Unknown action.' });
    }
  } catch (err) {
    logError_('doPost', err);
    return jsonOutput_(errorResponse_(err));
  }
}

function getStudents_(teacherKey) {
  try {
    const ctx = readAppContext_();
    const rubric = getRubric_();
    const students = ctx.rows
      .filter(function(row) {
        return matchesTeacher_(getValue_(row, ctx.headerMap, 'Teacher'), teacherKey);
      })
      .map(function(row) {
        return toStudentSummary_(buildStudentFromRow_(row, ctx.headerMap, ctx.settings, rubric));
      })
      .sort(compareStudents_);
    return {
      ok: true,
      students: students,
      summary: summarizeStudents_(students),
      rubric: rubric,
      settings: ctx.settings,
      teacher: CONFIG.TEACHERS[teacherKey] || null,
      totalMax: getRubricTotal_(rubric),
      spreadsheetUrl: ctx.ss.getUrl()
    };
  } catch (err) {
    logError_('getStudents_', err, { teacherKey: teacherKey });
    return errorResponse_(err);
  }
}

function getStudentDetails_(studentId, teacherKey) {
  try {
    if (!studentId) throw new Error('Missing student ID.');
    const ctx = readAppContext_();
    const rubric = getRubric_();
    const match = findStudentRow_(ctx.rows, ctx.headerMap, studentId);
    if (!match) throw new Error('Could not find student ' + studentId + '.');
    const student = buildStudentFromRow_(match.row, ctx.headerMap, ctx.settings, rubric);
    if (teacherKey && !matchesTeacher_(student.teacher, teacherKey)) {
      throw new Error('Student is not assigned to this teacher view.');
    }
    tryMarkStudentViewed_(match.rowNumber, ctx.headerMap);
    return {
      ok: true,
      student: student,
      rubric: rubric,
      settings: ctx.settings,
      teacher: CONFIG.TEACHERS[teacherKey] || null,
      totalMax: getRubricTotal_(rubric)
    };
  } catch (err) {
    logError_('getStudentDetails_', err, { studentId: studentId, teacherKey: teacherKey });
    return errorResponse_(err);
  }
}

function getAnalytics_(teacherKey) {
  try {
    const ctx = readAppContext_();
    const rubric = getRubric_();
    const students = ctx.rows
      .filter(function(row) {
        return matchesTeacher_(getValue_(row, ctx.headerMap, 'Teacher'), teacherKey);
      })
      .map(function(row) {
        return buildStudentFromRow_(row, ctx.headerMap, ctx.settings, rubric);
      })
      .sort(compareStudents_);
    const graded = students.filter(function(student) {
      return student.status === CONFIG.STATUS.COMPLETE;
    });
    const criterionAverages = rubric.map(function(criterion) {
      const scores = graded
        .map(function(student) { return scoreOrBlank_(student.scores[criterion.key]); })
        .filter(function(value) { return value !== ''; });
      const average = scores.length ? round1_(sum_(scores) / scores.length) : '';
      return {
        key: criterion.key,
        title: criterion.title,
        max: criterion.max,
        average: average,
        bandCounts: buildBandCounts_(criterion, graded)
      };
    });
    const vocabStats = students.reduce(function(acc, student) {
      const found = (student.vocabFound || []).length;
      if (found >= 6) acc.allSix += 1;
      if (found < 6) acc.missingAny += 1;
      acc.totalFound += found;
      return acc;
    }, { allSix: 0, missingAny: 0, totalFound: 0 });
    const byPeriod = {};
    students.forEach(function(student) {
      const key = String(student.period || '');
      if (!byPeriod[key]) {
        byPeriod[key] = {
          period: key,
          total: 0,
          complete: 0,
          inProgress: 0,
          noSubmission: 0,
          ungraded: 0,
          primeCount: 0,
          average: ''
        };
      }
      const bucket = byPeriod[key];
      bucket.total += 1;
      if (student.status === CONFIG.STATUS.COMPLETE) bucket.complete += 1;
      if (student.status === CONFIG.STATUS.IN_PROGRESS) bucket.inProgress += 1;
      if (student.status === CONFIG.STATUS.NO_SUBMISSION) bucket.noSubmission += 1;
      if (student.status === CONFIG.STATUS.UNGRADED) bucket.ungraded += 1;
      if (student.primeEligible === 'YES') bucket.primeCount += 1;
    });
    Object.keys(byPeriod).forEach(function(period) {
      const totals = students
        .filter(function(student) { return String(student.period) === period && student.totalScore !== ''; })
        .map(function(student) { return Number(student.totalScore); });
      byPeriod[period].average = totals.length ? round1_(sum_(totals) / totals.length) : '';
    });
    const scores = graded.map(function(student) { return Number(student.totalScore); });
    return {
      ok: true,
      summary: summarizeStudents_(students.map(toStudentSummary_)),
      teacher: CONFIG.TEACHERS[teacherKey] || null,
      totalMax: getRubricTotal_(rubric),
      criterionAverages: criterionAverages,
      primeCount: students.filter(function(student) { return student.primeEligible === 'YES'; }).length,
      averageScore: scores.length ? round1_(sum_(scores) / scores.length) : '',
      vocabStats: vocabStats,
      byPeriod: Object.keys(byPeriod).sort().map(function(period) { return byPeriod[period]; }),
      rubric: rubric
    };
  } catch (err) {
    logError_('getAnalytics_', err, { teacherKey: teacherKey });
    return errorResponse_(err);
  }
}

function uploadRoster_(payload) {
  try {
    const students = Array.isArray(payload.students) ? payload.students : [];
    const teacherKey = stringOrBlank_(payload.teacherKey).toLowerCase();
    if (!teacherKey || !CONFIG.TEACHERS[teacherKey]) throw new Error('Invalid teacher key.');
    return withDocumentWriteLock_(function() {
      const ss = bootstrapSpreadsheet_();
      const sheet = ss.getSheetByName(CONFIG.SHEETS.STUDENTS);
      const table = readTable_(sheet);
      const now = new Date();
      let upserted = 0;
      let skipped = 0;
      students.forEach(function(student) {
        const studentId = stringOrBlank_(student.studentId);
        if (!studentId) {
          skipped += 1;
          return;
        }
        const match = findStudentRow_(table.rows, table.headerMap, studentId);
        const row = match ? match.row : blankStudentRow_(table.headers.length);
        setRowValue_(row, table.headerMap, 'Student ID', studentId);
        setRowValue_(row, table.headerMap, 'Name', stringOrBlank_(student.name));
        setRowValue_(row, table.headerMap, 'Sort Name', stringOrBlank_(student.sortName) || sortName_(student.name));
        setRowValue_(row, table.headerMap, 'Period', stringOrBlank_(student.period));
        setRowValue_(row, table.headerMap, 'Teacher', teacherKey);
        setRowValue_(row, table.headerMap, 'Email', stringOrBlank_(student.email));
        setRowValue_(row, table.headerMap, 'Roster Loaded At', now);
        if (!match) {
          setRowValue_(row, table.headerMap, 'Status', CONFIG.STATUS.UNGRADED);
          setRowValue_(row, table.headerMap, 'Flagged', 'NO');
          setRowValue_(row, table.headerMap, 'PRIME Eligible', 'NO');
          setRowValue_(row, table.headerMap, 'PRIME Status', CONFIG.PRIME_STATUS.NOT_NEEDED);
          table.rows.push(row);
        }
        upserted += 1;
      });
      writeRowsBatch_(sheet, table.rows, table.headers.length);
      logAction_('uploadRoster', JSON.stringify({ teacherKey: teacherKey, upserted: upserted, skipped: skipped }));
      return { ok: true, upserted: upserted, skipped: skipped };
    });
  } catch (err) {
    logError_('uploadRoster_', err, { teacherKey: payload && payload.teacherKey });
    return errorResponse_(err);
  }
}

function uploadEssays_(payload) {
  try {
    const essays = Array.isArray(payload.essays) ? payload.essays : [];
    return withDocumentWriteLock_(function() {
      const ss = bootstrapSpreadsheet_();
      const sheet = ss.getSheetByName(CONFIG.SHEETS.STUDENTS);
      const table = readTable_(sheet);
      const now = new Date();
      let matched = 0;
      const unmatched = [];
      const lookup = buildNameLookup_(table.rows, table.headerMap);
      essays.forEach(function(entry) {
        const essayName = stringOrBlank_(entry.name);
        const essayText = stringOrBlank_(entry.essay);
        const match = lookup[normalizeForMatch_(essayName)] || lookup[normalizeForMatch_(sortName_(essayName))] || lookup[normalizeForMatch_(flipName_(essayName))];
        if (!match) {
          unmatched.push({ name: essayName });
          logAction_('unmatchedEssay', JSON.stringify({ name: essayName }));
          return;
        }
        setRowValue_(match.row, table.headerMap, 'Essay', essayText);
        setRowValue_(match.row, table.headerMap, 'Essay Loaded At', now);
        matched += 1;
      });
      writeRowsBatch_(sheet, table.rows, table.headers.length);
      logAction_('uploadEssays', JSON.stringify({ matched: matched, unmatched: unmatched.length }));
      return { ok: true, matched: matched, unmatched: unmatched };
    });
  } catch (err) {
    logError_('uploadEssays_', err);
    return errorResponse_(err);
  }
}

function saveGrade_(payload) {
  try {
    return withDocumentWriteLock_(function() {
      const ctx = readAppContext_();
      const rubric = getRubric_();
      const totalMax = getRubricTotal_(rubric);
      const match = findStudentRow_(ctx.rows, ctx.headerMap, payload.studentId);
      if (!match) throw new Error('Could not find student ' + payload.studentId + '.');
      const row = match.row;
      const scores = payload.scores || {};
      setRowValue_(row, ctx.headerMap, 'Claim Score', scoreOrBlank_(scores.claim));
      setRowValue_(row, ctx.headerMap, 'Evidence Score', scoreOrBlank_(scores.evidence));
      setRowValue_(row, ctx.headerMap, 'Reasoning Score', scoreOrBlank_(scores.reasoning));
      setRowValue_(row, ctx.headerMap, 'Mechanics Score', scoreOrBlank_(scores.mechanics));
      setRowValue_(row, ctx.headerMap, 'Comment', stringOrBlank_(payload.comment));
      setRowValue_(row, ctx.headerMap, 'Flagged', truthy_(payload.flagged) ? 'YES' : 'NO');
      setRowValue_(row, ctx.headerMap, 'Vocab Found', joinLabels_(payload.vocabFound));
      setRowValue_(row, ctx.headerMap, 'Vocab Missing', joinLabels_(payload.vocabMissing));
      setRowValue_(row, ctx.headerMap, 'Last Saved At', new Date());
      setRowValue_(row, ctx.headerMap, 'Last Saved By', getUserEmail_());
      recomputeStudentRow_(row, ctx.headerMap, ctx.settings, rubric, totalMax);
      writeSheetRow_(ctx.sheet, match.rowNumber, row);
      const student = buildStudentFromRow_(row, ctx.headerMap, ctx.settings, rubric);
      const responseStudents = ctx.rows.map(function(item, idx) {
        return idx === match.index ? student : buildStudentFromRow_(item, ctx.headerMap, ctx.settings, rubric);
      });
      return {
        ok: true,
        student: student,
        summary: summarizeStudents_(responseStudents.map(toStudentSummary_)),
        totalMax: totalMax,
        rubric: rubric
      };
    });
  } catch (err) {
    logError_('saveGrade_', err, { studentId: payload && payload.studentId });
    return errorResponse_(err);
  }
}

function savePrime_(payload) {
  try {
    return withDocumentWriteLock_(function() {
      const ctx = readAppContext_();
      const rubric = getRubric_();
      const match = findStudentRow_(ctx.rows, ctx.headerMap, payload.studentId);
      if (!match) throw new Error('Could not find student ' + payload.studentId + '.');
      const row = match.row;
      setRowValue_(row, ctx.headerMap, 'PRIME Status', stringOrBlank_(payload.primeStatus) || CONFIG.PRIME_STATUS.NOT_NEEDED);
      setRowValue_(row, ctx.headerMap, 'PRIME Comment', stringOrBlank_(payload.primeComment));
      setRowValue_(row, ctx.headerMap, 'PRIME Focus Areas', stringOrBlank_(payload.primeFocusAreas));
      setRowValue_(row, ctx.headerMap, 'Last Saved At', new Date());
      setRowValue_(row, ctx.headerMap, 'Last Saved By', getUserEmail_());
      writeSheetRow_(ctx.sheet, match.rowNumber, row);
      return { ok: true, student: buildStudentFromRow_(row, ctx.headerMap, ctx.settings, rubric) };
    });
  } catch (err) {
    logError_('savePrime_', err, { studentId: payload && payload.studentId });
    return errorResponse_(err);
  }
}

function markNoSubmission_(payload) {
  try {
    return withDocumentWriteLock_(function() {
      const ctx = readAppContext_();
      const rubric = getRubric_();
      const totalMax = getRubricTotal_(rubric);
      const match = findStudentRow_(ctx.rows, ctx.headerMap, payload.studentId);
      if (!match) throw new Error('Could not find student ' + payload.studentId + '.');
      const row = match.row;
      const noSubmission = truthy_(payload.noSubmission);
      if (noSubmission) {
        setRowValue_(row, ctx.headerMap, 'Status', CONFIG.STATUS.NO_SUBMISSION);
        setRowValue_(row, ctx.headerMap, 'PRIME Eligible', 'NO');
        setRowValue_(row, ctx.headerMap, 'PRIME Status', CONFIG.PRIME_STATUS.NOT_NEEDED);
        setRowValue_(row, ctx.headerMap, 'Total Score', '');
        setRowValue_(row, ctx.headerMap, 'Percent', '');
      } else {
        recomputeStudentRow_(row, ctx.headerMap, ctx.settings, rubric, totalMax);
      }
      setRowValue_(row, ctx.headerMap, 'Last Saved At', new Date());
      setRowValue_(row, ctx.headerMap, 'Last Saved By', getUserEmail_());
      writeSheetRow_(ctx.sheet, match.rowNumber, row);
      const student = buildStudentFromRow_(row, ctx.headerMap, ctx.settings, rubric);
      const responseStudents = ctx.rows.map(function(item, idx) {
        return idx === match.index ? student : buildStudentFromRow_(item, ctx.headerMap, ctx.settings, rubric);
      });
      return {
        ok: true,
        student: student,
        summary: summarizeStudents_(responseStudents.map(toStudentSummary_))
      };
    });
  } catch (err) {
    logError_('markNoSubmission_', err, { studentId: payload && payload.studentId });
    return errorResponse_(err);
  }
}

function markPrimePrinted_(payload) {
  try {
    return withDocumentWriteLock_(function() {
      const ctx = readAppContext_();
      const rubric = getRubric_();
      const match = findStudentRow_(ctx.rows, ctx.headerMap, payload.studentId);
      if (!match) throw new Error('Could not find student ' + payload.studentId + '.');
      setRowValue_(match.row, ctx.headerMap, 'PRIME Status', CONFIG.PRIME_STATUS.PRINTED);
      setRowValue_(match.row, ctx.headerMap, 'PRIME Printed At', new Date());
      setRowValue_(match.row, ctx.headerMap, 'Last Saved At', new Date());
      setRowValue_(match.row, ctx.headerMap, 'Last Saved By', getUserEmail_());
      writeSheetRow_(ctx.sheet, match.rowNumber, match.row);
      return { ok: true, student: buildStudentFromRow_(match.row, ctx.headerMap, ctx.settings, rubric) };
    });
  } catch (err) {
    logError_('markPrimePrinted_', err, { studentId: payload && payload.studentId });
    return errorResponse_(err);
  }
}

function saveRubric_(payload) {
  try {
    const rubric = payload.rubric;
    validateRubric_(rubric);
    const totalMax = getRubricTotal_(rubric);
    return withDocumentWriteLock_(function() {
      const ss = bootstrapSpreadsheet_();
      upsertSetting_(ss.getSheetByName(CONFIG.SHEETS.SETTINGS), 'Rubric JSON', JSON.stringify(rubric));
      logAction_('saveRubric', JSON.stringify({ totalMax: totalMax }));
      return {
        ok: true,
        rubric: rubric,
        totalMax: totalMax,
        totalChanged: totalMax !== CONFIG.TOTAL_MAX
      };
    });
  } catch (err) {
    logError_('saveRubric_', err);
    return errorResponse_(err);
  }
}

function readAppContext_() {
  const ss = bootstrapSpreadsheet_();
  const sheet = ss.getSheetByName(CONFIG.SHEETS.STUDENTS);
  const table = readTable_(sheet);
  return {
    ss: ss,
    sheet: sheet,
    settings: readSettings_(ss),
    table: table,
    rows: table.rows,
    headers: table.headers,
    headerMap: table.headerMap
  };
}

function bootstrapSpreadsheet_() {
  const ss = getSpreadsheet_();
  ensureSheetWithHeaders_(ss, CONFIG.SHEETS.STUDENTS, CONFIG.STUDENT_HEADERS);
  ensureSettingsSheet_(ss);
  ensureSheetWithHeaders_(ss, CONFIG.SHEETS.LOG, ['Timestamp', 'Action', 'Details']);
  return ss;
}

function getRubric_() {
  const settings = readSettings_(getSpreadsheet_());
  const raw = settings['Rubric JSON'] || '';
  if (!raw) return RUBRIC;
  try {
    const parsed = JSON.parse(raw);
    validateRubric_(parsed);
    return parsed;
  } catch (err) {
    return RUBRIC;
  }
}

function getSpreadsheet_() {
  return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
}

function getWriteLock_() {
  const lock = LockService.getScriptLock();
  if (!lock) throw new Error('Unable to acquire GAS lock.');
  return lock;
}

function withDocumentWriteLock_(callback) {
  const lock = getWriteLock_();
  lock.waitLock(5000);
  try {
    return callback();
  } finally {
    lock.releaseLock();
  }
}

function ensureSheetWithHeaders_(ss, name, headers) {
  const sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  const lastColumn = Math.max(sheet.getLastColumn(), headers.length);
  const currentHeaders = lastColumn ? sheet.getRange(1, 1, 1, lastColumn).getValues()[0] : [];
  let changed = false;
  headers.forEach(function(header, index) {
    if (currentHeaders[index] !== header) {
      sheet.getRange(1, index + 1).setValue(header);
      changed = true;
    }
  });
  if (changed) sheet.setFrozenRows(1);
  return sheet;
}

function ensureSettingsSheet_(ss) {
  const sheet = ensureSheetWithHeaders_(ss, CONFIG.SHEETS.SETTINGS, ['Setting', 'Value']);
  const existing = readSettings_(ss);
  Object.keys(CONFIG.SETTINGS_DEFAULTS).forEach(function(key) {
    if (existing[key] === undefined || existing[key] === '') {
      upsertSetting_(sheet, key, CONFIG.SETTINGS_DEFAULTS[key]);
    }
  });
  if (existing['Rubric JSON'] === undefined) {
    upsertSetting_(sheet, 'Rubric JSON', JSON.stringify(RUBRIC));
  }
  return sheet;
}

function readSettings_(ss) {
  const sheet = ss.getSheetByName(CONFIG.SHEETS.SETTINGS) || ensureSettingsSheet_(ss);
  const values = sheet.getDataRange().getValues();
  const settings = {};
  for (var i = 1; i < values.length; i += 1) {
    const key = stringOrBlank_(values[i][0]);
    if (!key) continue;
    settings[key] = values[i][1];
  }
  return settings;
}

function readTable_(sheet) {
  const data = sheet.getDataRange().getValues();
  const headers = data.length ? data[0] : [];
  const headerMap = {};
  headers.forEach(function(header, index) {
    headerMap[String(header)] = index;
  });
  return {
    headers: headers,
    headerMap: headerMap,
    rows: data.slice(1)
  };
}

function findStudentRow_(rows, headerMap, studentId) {
  const target = stringOrBlank_(studentId);
  for (var i = 0; i < rows.length; i += 1) {
    if (stringOrBlank_(getValue_(rows[i], headerMap, 'Student ID')) === target) {
      return { index: i, rowNumber: i + 2, row: rows[i] };
    }
  }
  return null;
}

function getValue_(row, headerMap, header) {
  if (!row || headerMap[header] === undefined) return '';
  return row[headerMap[header]];
}

function setRowValue_(row, headerMap, header, value) {
  if (headerMap[header] === undefined) return;
  row[headerMap[header]] = value;
}

function writeSheetRow_(sheet, rowNumber, row) {
  sheet.getRange(rowNumber, 1, 1, row.length).setValues([row]);
}

function writeRowsBatch_(sheet, rows, width) {
  if (!rows.length) return;
  sheet.getRange(2, 1, Math.max(rows.length, 1), width).clearContent();
  sheet.getRange(2, 1, rows.length, width).setValues(rows);
}

function recomputeStudentRow_(row, headerMap, settings, rubric, totalMax) {
  const claim = scoreOrBlank_(getValue_(row, headerMap, 'Claim Score'));
  const evidence = scoreOrBlank_(getValue_(row, headerMap, 'Evidence Score'));
  const reasoning = scoreOrBlank_(getValue_(row, headerMap, 'Reasoning Score'));
  const mechanics = scoreOrBlank_(getValue_(row, headerMap, 'Mechanics Score'));
  const scores = [claim, evidence, reasoning, mechanics];
  const hasAny = scores.some(function(score) { return score !== ''; });
  const allPresent = scores.every(function(score) { return score !== ''; });
  const currentStatus = stringOrBlank_(getValue_(row, headerMap, 'Status'));
  if (currentStatus === CONFIG.STATUS.NO_SUBMISSION) return row;
  const total = allPresent ? round1_(sum_(scores.map(Number))) : hasAny ? round1_(sum_(scores.filter(function(score) { return score !== ''; }).map(Number))) : '';
  const percent = allPresent && totalMax ? round1_((Number(total) / totalMax) * 100) : '';
  let status = CONFIG.STATUS.UNGRADED;
  if (allPresent) status = CONFIG.STATUS.COMPLETE;
  else if (hasAny) status = CONFIG.STATUS.IN_PROGRESS;
  const primeEligible = status === CONFIG.STATUS.COMPLETE && Number(percent) < Number(settings['Revise To Percent'] || CONFIG.PRIME_THRESHOLD_PCT) ? 'YES' : 'NO';
  const currentPrimeStatus = stringOrBlank_(getValue_(row, headerMap, 'PRIME Status')) || CONFIG.PRIME_STATUS.NOT_NEEDED;
  var nextPrimeStatus = currentPrimeStatus;
  if (primeEligible === 'YES' && currentPrimeStatus === CONFIG.PRIME_STATUS.NOT_NEEDED) nextPrimeStatus = CONFIG.PRIME_STATUS.NEEDS;
  if (primeEligible !== 'YES') nextPrimeStatus = CONFIG.PRIME_STATUS.NOT_NEEDED;
  const rubricByKey = {};
  (rubric || RUBRIC).forEach(function(criterion) {
    rubricByKey[criterion.key] = criterion;
  });
  const focusAreas = [];
  [
    { key: 'claim', value: claim },
    { key: 'evidence', value: evidence },
    { key: 'reasoning', value: reasoning },
    { key: 'mechanics', value: mechanics }
  ].forEach(function(item) {
    const criterion = rubricByKey[item.key];
    if (!criterion || item.value === '') return;
    if (Number(item.value) < Number(criterion.max) * 0.75) focusAreas.push(criterion.title);
  });
  setRowValue_(row, headerMap, 'Total Score', total);
  setRowValue_(row, headerMap, 'Percent', percent);
  setRowValue_(row, headerMap, 'Status', status);
  setRowValue_(row, headerMap, 'PRIME Eligible', primeEligible);
  setRowValue_(row, headerMap, 'PRIME Status', nextPrimeStatus);
  setRowValue_(row, headerMap, 'PRIME Focus Areas', focusAreas.join(', '));
  return row;
}

function buildStudentFromRow_(row, headerMap, settings, rubric) {
  const actualRubric = rubric || RUBRIC;
  const student = {
    studentId: stringOrBlank_(getValue_(row, headerMap, 'Student ID')),
    name: stringOrBlank_(getValue_(row, headerMap, 'Name')),
    sortName: stringOrBlank_(getValue_(row, headerMap, 'Sort Name')),
    period: stringOrBlank_(getValue_(row, headerMap, 'Period')),
    teacher: stringOrBlank_(getValue_(row, headerMap, 'Teacher')),
    email: stringOrBlank_(getValue_(row, headerMap, 'Email')),
    essay: stringOrBlank_(getValue_(row, headerMap, 'Essay')),
    scores: {
      claim: scoreOrBlank_(getValue_(row, headerMap, 'Claim Score')),
      evidence: scoreOrBlank_(getValue_(row, headerMap, 'Evidence Score')),
      reasoning: scoreOrBlank_(getValue_(row, headerMap, 'Reasoning Score')),
      mechanics: scoreOrBlank_(getValue_(row, headerMap, 'Mechanics Score'))
    },
    totalScore: scoreOrBlank_(getValue_(row, headerMap, 'Total Score')),
    percent: scoreOrBlank_(getValue_(row, headerMap, 'Percent')),
    status: stringOrBlank_(getValue_(row, headerMap, 'Status')) || CONFIG.STATUS.UNGRADED,
    flagged: stringOrBlank_(getValue_(row, headerMap, 'Flagged')) === 'YES',
    primeEligible: stringOrBlank_(getValue_(row, headerMap, 'PRIME Eligible')) || 'NO',
    primeStatus: stringOrBlank_(getValue_(row, headerMap, 'PRIME Status')) || CONFIG.PRIME_STATUS.NOT_NEEDED,
    primeComment: stringOrBlank_(getValue_(row, headerMap, 'PRIME Comment')) || stringOrBlank_(settings['PRIME Comment Text']),
    primeFocusAreas: stringOrBlank_(getValue_(row, headerMap, 'PRIME Focus Areas')),
    primePrintedAt: dateToIso_(getValue_(row, headerMap, 'PRIME Printed At')),
    vocabFound: splitLabels_(getValue_(row, headerMap, 'Vocab Found')),
    vocabMissing: splitLabels_(getValue_(row, headerMap, 'Vocab Missing')),
    comment: stringOrBlank_(getValue_(row, headerMap, 'Comment')),
    lastSavedAt: dateToIso_(getValue_(row, headerMap, 'Last Saved At')),
    lastSavedBy: stringOrBlank_(getValue_(row, headerMap, 'Last Saved By')),
    rosterLoadedAt: dateToIso_(getValue_(row, headerMap, 'Roster Loaded At')),
    essayLoadedAt: dateToIso_(getValue_(row, headerMap, 'Essay Loaded At')),
    hasEssay: !!stringOrBlank_(getValue_(row, headerMap, 'Essay')),
    rubric: actualRubric
  };
  return student;
}

function toStudentSummary_(student) {
  return {
    studentId: student.studentId,
    name: student.name,
    sortName: student.sortName,
    period: student.period,
    teacher: student.teacher,
    email: student.email,
    status: student.status,
    totalScore: student.totalScore,
    percent: student.percent,
    flagged: student.flagged,
    primeEligible: student.primeEligible,
    primeStatus: student.primeStatus,
    vocabFound: student.vocabFound,
    vocabMissing: student.vocabMissing,
    hasEssay: student.hasEssay
  };
}

function normalizeForMatch_(value) {
  return stringOrBlank_(value).toLowerCase().replace(/[^a-z0-9]/g, '');
}

function sortName_(name) {
  const parts = stringOrBlank_(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return stringOrBlank_(name);
  const last = parts.pop();
  return last + ', ' + parts.join(' ');
}

function flipName_(name) {
  const raw = stringOrBlank_(name);
  if (raw.indexOf(',') > -1) {
    var pieces = raw.split(',');
    return stringOrBlank_(pieces[1]) + ' ' + stringOrBlank_(pieces[0]);
  }
  return sortName_(raw);
}

function scoreOrBlank_(value) {
  if (value === '' || value === null || value === undefined) return '';
  const num = Number(value);
  return isNaN(num) ? '' : round1_(num);
}

function stringOrBlank_(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function truthy_(value) {
  const normalized = stringOrBlank_(value).toLowerCase();
  return value === true || normalized === 'true' || normalized === 'yes' || normalized === 'y' || normalized === '1';
}

function dateToIso_(value) {
  if (!value) return '';
  try {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '';
    return date.toISOString();
  } catch (err) {
    return '';
  }
}

function escapeHtml_(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getUserEmail_() {
  return Session.getActiveUser().getEmail() || Session.getEffectiveUser().getEmail() || '';
}

function logError_(action, err, details) {
  try {
    logAction_('error:' + action, JSON.stringify({
      message: err && err.message ? err.message : String(err),
      stack: err && err.stack ? err.stack : '',
      details: details || {}
    }));
  } catch (innerErr) {
    console.error(innerErr);
  }
}

function errorResponse_(err) {
  return { ok: false, message: err && err.message ? err.message : String(err) };
}

function jsonOutput_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

function validateRubric_(rubric) {
  if (!Array.isArray(rubric) || !rubric.length) throw new Error('Rubric must be a non-empty array.');
  rubric.forEach(function(criterion, index) {
    if (!criterion || !stringOrBlank_(criterion.key)) throw new Error('Criterion ' + (index + 1) + ' is missing a key.');
    if (!stringOrBlank_(criterion.title)) throw new Error('Criterion ' + (index + 1) + ' is missing a title.');
    if (isNaN(Number(criterion.max)) || Number(criterion.max) <= 0) throw new Error(criterion.title + ' must have max points greater than 0.');
    if (!Array.isArray(criterion.bands) || !criterion.bands.length) throw new Error(criterion.title + ' must have at least one band.');
    criterion.bands.forEach(function(band, bandIndex) {
      if (!stringOrBlank_(band.label)) throw new Error(criterion.title + ' band ' + (bandIndex + 1) + ' is missing a label.');
      if (isNaN(Number(band.score)) || Number(band.score) < 0) throw new Error(criterion.title + ' band ' + (bandIndex + 1) + ' must have a non-negative score.');
      if (!stringOrBlank_(band.text)) throw new Error(criterion.title + ' band ' + (bandIndex + 1) + ' is missing description text.');
    });
  });
}

function getRubricTotal_(rubric) {
  return round1_(sum_((rubric || []).map(function(criterion) { return Number(criterion.max) || 0; }))) || CONFIG.TOTAL_MAX;
}

function summarizeStudents_(students) {
  const summary = {
    total: students.length,
    complete: 0,
    inProgress: 0,
    noSubmission: 0,
    ungraded: 0,
    primeCount: 0
  };
  students.forEach(function(student) {
    if (student.status === CONFIG.STATUS.COMPLETE) summary.complete += 1;
    else if (student.status === CONFIG.STATUS.IN_PROGRESS) summary.inProgress += 1;
    else if (student.status === CONFIG.STATUS.NO_SUBMISSION) summary.noSubmission += 1;
    else summary.ungraded += 1;
    if (student.primeEligible === 'YES') summary.primeCount += 1;
  });
  return summary;
}

function buildNameLookup_(rows, headerMap) {
  const lookup = {};
  rows.forEach(function(row, index) {
    const entry = { row: row, index: index, rowNumber: index + 2 };
    [
      getValue_(row, headerMap, 'Name'),
      getValue_(row, headerMap, 'Sort Name'),
      flipName_(getValue_(row, headerMap, 'Name')),
      flipName_(getValue_(row, headerMap, 'Sort Name'))
    ].forEach(function(name) {
      const key = normalizeForMatch_(name);
      if (key && !lookup[key]) lookup[key] = entry;
    });
  });
  return lookup;
}

function tryMarkStudentViewed_(rowNumber, headerMap) {
  try {
    if (headerMap['Last Viewed At'] === undefined) return;
    const sheet = getSpreadsheet_().getSheetByName(CONFIG.SHEETS.STUDENTS);
    sheet.getRange(rowNumber, headerMap['Last Viewed At'] + 1).setValue(new Date());
  } catch (err) {
    console.warn(err);
  }
}

function matchesTeacher_(rowTeacher, teacherKey) {
  return stringOrBlank_(rowTeacher).toLowerCase() === stringOrBlank_(teacherKey).toLowerCase();
}

function splitLabels_(value) {
  return stringOrBlank_(value) ? String(value).split(/\s*,\s*/).filter(Boolean) : [];
}

function joinLabels_(value) {
  return Array.isArray(value) ? value.filter(Boolean).join(', ') : '';
}

function buildBandCounts_(criterion, students) {
  const counts = {};
  (criterion.bands || []).forEach(function(band) {
    counts[band.label] = 0;
  });
  students.forEach(function(student) {
    const score = student.scores[criterion.key];
    const match = (criterion.bands || []).find(function(band) {
      return Number(band.score) === Number(score);
    });
    if (match) counts[match.label] += 1;
  });
  return counts;
}

function blankStudentRow_(length) {
  return Array.apply(null, Array(length)).map(function() { return ''; });
}

function upsertSetting_(sheet, key, value) {
  const data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i += 1) {
    if (stringOrBlank_(data[i][0]) === key) {
      sheet.getRange(i + 1, 2).setValue(value);
      return;
    }
  }
  sheet.appendRow([key, value]);
}

function buildStatusPage_() {
  return [
    '<!doctype html><html><head><meta charset="utf-8"><title>Iran Summative API</title>',
    '<style>body{font-family:Arial,sans-serif;padding:32px;color:#203044}code{background:#f4f6ff;padding:2px 6px;border-radius:6px}</style>',
    '</head><body>',
    '<h1>Iran Summative API</h1>',
    '<p>This Apps Script deployment is live.</p>',
    '<p>Reads: <code>?action=getStudents&amp;teacherKey=tinsley</code></p>',
    '<p>Writes: <code>POST {"action":"saveGrade",...}</code></p>',
    '</body></html>'
  ].join('');
}

function logAction_(action, details) {
  try {
    const sheet = ensureSheetWithHeaders_(getSpreadsheet_(), CONFIG.SHEETS.LOG, ['Timestamp', 'Action', 'Details']);
    sheet.appendRow([new Date(), action, details || '']);
  } catch (err) {
    console.error(err);
  }
}

function sum_(values) {
  return values.reduce(function(total, value) { return total + Number(value || 0); }, 0);
}

function round1_(value) {
  return Math.round(Number(value) * 10) / 10;
}

function compareStudents_(a, b) {
  return String(a.sortName || a.name).localeCompare(String(b.sortName || b.name));
}
