/**
 * code.gs - REST API Router untuk Google Spreadsheet Database Cafe Syar'i
 *
 * Menghubungkan server Next.js ke Google Spreadsheet secara aman.
 * Hanya server Next.js yang memiliki APPS_SCRIPT_SECRET yang dapat mengakses endpoint ini.
 */

function doGet(e) {
  return handleRequest(e, 'GET');
}

function doPost(e) {
  return handleRequest(e, 'POST');
}

function handleRequest(e, method) {
  try {
    var payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (err) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    // 1. Verifikasi Rahasia Token (APPS_SCRIPT_SECRET)
    var scriptProps = PropertiesService.getScriptProperties();
    var registeredSecret = scriptProps.getProperty('APPS_SCRIPT_SECRET');

    // Jika belum diset di Script Properties, gunakan fallback atau tolak
    var incomingSecret = payload.secret || (e && e.parameter ? e.parameter.secret : '');
    
    if (registeredSecret && incomingSecret !== registeredSecret) {
      return jsonResponse({
        success: false,
        error: 'Akses ditolak: Secret token tidak valid.'
      }, 403);
    }

    var action = payload.action || (e && e.parameter ? e.parameter.action : '');
    var table = payload.table || (e && e.parameter ? e.parameter.table : '');

    if (!table) {
      return jsonResponse({
        success: false,
        error: 'Parameter table wajib disertakan.'
      }, 400);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(table);
    if (!sheet) {
      return jsonResponse({
        success: false,
        error: 'Tabel "' + table + '" tidak ditemukan di database spreadsheet.'
      }, 404);
    }

    var result = null;

    switch (action) {
      case 'find':
        result = handleFind(sheet, payload.query || {});
        break;

      case 'findOne':
        result = handleFindOne(sheet, payload.query || {});
        break;

      case 'findById':
        result = handleFindById(sheet, payload.id);
        break;

      case 'create':
        result = handleCreate(sheet, payload.data || {});
        break;

      case 'update':
        result = handleUpdate(sheet, payload.id, payload.data || {});
        break;

      case 'delete':
        result = handleDelete(sheet, payload.id);
        break;

      default:
        return jsonResponse({
          success: false,
          error: 'Action tidak dikenal: ' + action
        }, 400);
    }

    return jsonResponse({
      success: true,
      data: result
    });

  } catch (err) {
    return jsonResponse({
      success: false,
      error: err.toString()
    }, 500);
  }
}

function handleFind(sheet, query) {
  var data = getTableRows(sheet);
  if (!query || Object.keys(query).length === 0) {
    return data;
  }

  return data.filter(function(row) {
    for (var key in query) {
      if (row[key] !== query[key]) {
        return false;
      }
    }
    return true;
  });
}

function handleFindOne(sheet, query) {
  var items = handleFind(sheet, query);
  return items.length > 0 ? items[0] : null;
}

function handleFindById(sheet, id) {
  var data = getTableRows(sheet);
  for (var i = 0; i < data.length; i++) {
    if (data[i].id === id) {
      return data[i];
    }
  }
  return null;
}

function handleCreate(sheet, data) {
  var headers = getHeaders(sheet);
  if (!data.id) {
    data.id = Utilities.getUuid();
  }
  if (!data.created_at) {
    data.created_at = new Date().toISOString();
  }
  if (!data.updated_at) {
    data.updated_at = new Date().toISOString();
  }

  var row = [];
  for (var i = 0; i < headers.length; i++) {
    var val = data[headers[i]];
    row.push(val !== undefined && val !== null ? val : '');
  }

  sheet.appendRow(row);
  return data;
}

function handleUpdate(sheet, id, data) {
  if (!id) throw new Error('ID wajib disertakan untuk operasi update.');

  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow <= 1) throw new Error('Data tidak ditemukan.');

  var headers = getHeaders(sheet);
  var idColIndex = headers.indexOf('id');
  if (idColIndex === -1) throw new Error('Kolom ID tidak ditemukan pada tabel.');

  var values = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();

  for (var r = 0; r < values.length; r++) {
    if (values[r][idColIndex] === id) {
      var rowIndex = r + 2; // Baris riil di sheet (1-based, setelah header)
      data.updated_at = new Date().toISOString();

      for (var key in data) {
        var colIndex = headers.indexOf(key);
        if (colIndex !== -1 && key !== 'id') {
          sheet.getRange(rowIndex, colIndex + 1).setValue(data[key]);
        }
      }
      return handleFindById(sheet, id);
    }
  }

  throw new Error('Data dengan ID ' + id + ' tidak ditemukan.');
}

function handleDelete(sheet, id) {
  if (!id) throw new Error('ID wajib disertakan untuk operasi delete.');

  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow <= 1) throw new Error('Data tidak ditemukan.');

  var headers = getHeaders(sheet);
  var idColIndex = headers.indexOf('id');
  if (idColIndex === -1) throw new Error('Kolom ID tidak ditemukan.');

  var values = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();

  for (var r = 0; r < values.length; r++) {
    if (values[r][idColIndex] === id) {
      var rowIndex = r + 2;
      sheet.deleteRow(rowIndex);
      return { id: id, deleted: true };
    }
  }

  throw new Error('Data dengan ID ' + id + ' tidak ditemukan.');
}

function getHeaders(sheet) {
  var lastCol = sheet.getLastColumn();
  if (lastCol === 0) return [];
  return sheet.getRange(1, 1, 1, lastCol).getValues()[0];
}

function getTableRows(sheet) {
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow <= 1) return [];

  var headers = getHeaders(sheet);
  var values = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();

  var list = [];
  for (var r = 0; r < values.length; r++) {
    var obj = {};
    for (var c = 0; c < headers.length; c++) {
      obj[headers[c]] = values[r][c];
    }
    list.push(obj);
  }
  return list;
}

function jsonResponse(obj, statusCode) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
