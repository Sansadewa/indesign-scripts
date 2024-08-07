/*
About Script :
Script ini digunakan untuk memetakan data di dalam sebuah cell, relatif terhadap string terbesar yang ada pada kolom itu.
Data dipetakan menggunakan right indent karena mayoritas tabel menggunakan angka.

String Terpanjang diukur dengan membuat sebuat textbox baru, menerapkan Font Lato Bold, dan mengukur lebar dari textbox tersebut.

Perhitungan Right Indent sebagai berikut:
beri right indent sebesar (lebar kolom - lebar string terpanjang) dibagi 2

Next Development: Dropdown font family, style, size. Sisanya belum kepikiran perlu apalagi.

Kalau ada yang salah mohon dikabari, atau kita develop bareng saja, Scriptnya ada di https://github.com/Sansadewa/indesign-scripts
bisa juga hubungi via email: gibran.sansadewa@bps.go.id / asshadiqi.gibran@gmail.com
*/

var longstring = ""; //iya, saya malas kirim kirim method hehe
var userInputString = ""; // Variable to store user input
var continueProcessing = false; // Flag to control table processing
var doFollowProcessing = true;
var fontangkanya ="";
var fontSizeangkanya="";
var fontStyleangkanya="";

// Function to create initial info dialog and user input
function showInitialDialog() {
    var panelWidth = 800; // Adjust this value as needed
    var initialDialog = new Window("dialog", "Script Penyesuaian Right Indent", undefined, {resizeable: false});
    initialDialog.orientation = "column";
    initialDialog.alignChildren = ["center", "top"];
    initialDialog.spacing = 10;
    initialDialog.margins = 16;

    // Script info panel
    var infoPanel = initialDialog.add("panel", undefined, "Informasi Script");
    infoPanel.orientation = "column";
    infoPanel.alignChildren = ["left", "top"];
    infoPanel.margins = 10;
    infoPanel.spacing = 4;
    infoPanel.preferredSize.width = panelWidth;
    infoPanel.add("statictext", undefined, "Nama Script: Format Tabel InDesign");
    infoPanel.add("statictext", undefined, "Deskripsi: Script ini melakukan right indent dengan menghitung lebar string terbesar terhadap suatu kolom.");

    // Script versi panel
    var versiPanel = initialDialog.add("panel", undefined, "Versi Script");
    versiPanel.orientation = "column";
    versiPanel.alignChildren = ["left", "top"];
    versiPanel.margins = 10;
    versiPanel.preferredSize.width = panelWidth;

    var versiGroup = versiPanel.add("group");
    versiGroup.orientation = "column";
    versiGroup.alignChildren = ["left", "top"];

    versiGroup.add("statictext", undefined, "Pembuat: BPS Prov. Kalsel");
    versiGroup.add("statictext", undefined, "Versi: 0.1.0 | Cek versi terbaru di github.com/Sansadewa");

    // Divider
    var divider = initialDialog.add("panel");
    divider.alignment = "fill"; 

    // Script opsi panel
    var opsiPanel = initialDialog.add("panel", undefined, "Opsi Script");
    opsiPanel.orientation = "column";
    opsiPanel.alignChildren = ["left", "top"];
    opsiPanel.margins = 10;
    opsiPanel.preferredSize.width = panelWidth;

    // Input group
    var inputGroup = opsiPanel.add("group");
    inputGroup.orientation = "row";
    inputGroup.alignChildren = ["left", "center"];
    inputGroup.spacing = 10;

    inputGroup.add("statictext", undefined, "Masukkan Nama Region Pertama (Prov/Kab/Kec):");
    var inputField = inputGroup.add("edittext", undefined, "Kabupaten Tanah Laut");
    inputField.characters = 30;

    // Font selection group
    var fontGroup = opsiPanel.add("group");
    fontGroup.orientation = "row";
    fontGroup.alignChildren = ["left", "center"];
    fontGroup.spacing = 10;

    fontGroup.add("statictext", undefined, "Masukkan Nama Font Family di Tabel:");
    var inputField2 = fontGroup.add("edittext", undefined, "Lato");
    inputField2.characters = 10;

    // Font style selection group
    var fontStyleGroup = opsiPanel.add("group");
    fontStyleGroup.orientation = "row";
    fontStyleGroup.alignChildren = ["left", "center"];
    fontStyleGroup.spacing = 10;

    fontStyleGroup.add("statictext", undefined, "Masukkan Nama Font Style di Tabel:");
    var inputField3 = fontStyleGroup.add("edittext", undefined, "Bold");
    inputField3.characters = 10;

    // Font size selection group
    var fontSizeGroup = opsiPanel.add("group");
    fontSizeGroup.orientation = "row";
    fontSizeGroup.alignChildren = ["left", "center"];
    fontSizeGroup.spacing = 10;

    fontSizeGroup.add("statictext", undefined, "Masukkan Ukuran Font di Tabel:");
    var inputField4 = fontSizeGroup.add("edittext", undefined, "7");
    inputField4.characters = 5;

    // Checkbox group
    var checkGroup = opsiPanel.add("group");
    checkGroup.orientation = "row";
    checkGroup.alignChildren = ["left", "center"];
    checkGroup.spacing = 10;

    // Checkbox for doFollowProcessing
    var followProcessingCheckbox = checkGroup.add("checkbox", undefined, "Ikuti Pemrosesan Tabel (Jendela bergerak mengikuti progress Script)");
    followProcessingCheckbox.value = doFollowProcessing; // Set initial state

    // Buttons
    var buttonGroup = initialDialog.add("group");
    buttonGroup.orientation = "row";
    buttonGroup.alignChildren = ["center", "center"];
    buttonGroup.spacing = 10;

    var okButton = buttonGroup.add("button", undefined, "OK", {name: "ok"});
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");

    var result = false;

    okButton.onClick = function() {
        userInputString = inputField.text;
        fontangkanya = inputField2.text; // Get selected font
        fontSizeangkanya = inputField4.text; // Get selected font size
        fontStyleangkanya = inputField3.text; // Get selected font style
        result = true;
        doFollowProcessing = followProcessingCheckbox.value; // Update the global flag
        initialDialog.close();
    }

    cancelButton.onClick = function() {
        initialDialog.close();
    }

    initialDialog.show();
    
    return result;
}


// Function to create confirmation dialog for each table using ScriptUI
function showTableConfirmationDialog() {
    var mainWindow = new Window("dialog", "Konfirmasi Tabel", undefined, {resizeable: false});
    mainWindow.orientation = "column";
    mainWindow.alignChildren = ["center", "top"];
    mainWindow.spacing = 10;
    mainWindow.margins = 16;
    if(doFollowProcessing===true){
        msg = "Proses Tabel Ini?";
    } else {msg = "Lanjut ke tabel selanjutnya?"}
    var questionText = mainWindow.add("statictext", undefined, msg);
    questionText.alignment = ["center", "top"];

    var controlGroup = mainWindow.add("group");
    controlGroup.orientation = "row";
    controlGroup.alignChildren = ["center", "center"];
    controlGroup.spacing = 10;

    var lanjutButton = controlGroup.add("button", undefined, "Lanjut");
    var skipButton = controlGroup.add("button", undefined, "Skip Tabel Ini");
    var stopButton = controlGroup.add("button", undefined, "Stop");
    var lanjutTerusButton = controlGroup.add("button", undefined, "Lanjut Sampai Tabel Terakhir!");

    var result;

    lanjutButton.onClick = function() {
        result = 1;
        mainWindow.close();
    }

    stopButton.onClick = function() {
        result = 2;
        mainWindow.close();
    }

    lanjutTerusButton.onClick = function() {
        result = 3;
        mainWindow.close();
    }

    skipButton.onClick = function() {
        result = 4;
        mainWindow.close();
    }

    mainWindow.onClose = function() {
        if (result === undefined) result = 2; // Default to Stop if window is closed
    }

    mainWindow.show();
    
    return result;
}

function showErrorDialog(errorDetails) {
    var errorDialog = new Window("dialog", "Error: Bilangan Terlalu Panjang", undefined, {resizeable: false});
    errorDialog.orientation = "column";
    errorDialog.alignChildren = ["left", "top"];
    errorDialog.spacing = 10;
    errorDialog.margins = 16;

    // Error info panel
    var infoPanel = errorDialog.add("panel", undefined, "Detail Error");
    infoPanel.orientation = "column";
    infoPanel.alignChildren = ["left", "top"];
    infoPanel.margins = 10;

    infoPanel.add("statictext", undefined, "Lokasi: " + errorDetails.location);
    infoPanel.add("statictext", undefined, "Nilai Right Indent: " + errorDetails.rightIndent.toFixed(2) + " pt");
    infoPanel.add("statictext", undefined, "Lebar Kolom: " + errorDetails.columnWidth.toFixed(2) + " pt");
    infoPanel.add("statictext", undefined, "Lebar Bilangan Terbesar: " + errorDetails.longestStringWidth.toFixed(2) + " pt");
    infoPanel.add("statictext", undefined, "Bilangan Terbesar: " + errorDetails.longstring);
    infoPanel.add("statictext", undefined, "Adj Method: " + errorDetails.adjustmethod);

    // Action info
    var actionPanel = errorDialog.add("panel", undefined, "Tindakan");
    actionPanel.orientation = "column";
    actionPanel.alignChildren = ["left", "top"];
    actionPanel.margins = 10;

    actionPanel.add("statictext", undefined, "Right Indent akan diatur menjadi 0 dan sel akan diwarnai kuning.");

    // OK button
    var okButton = errorDialog.add("button", undefined, "OK", {name: "ok"});
    // var stopButton = errorDialog.add("button", undefined, "STOP", {name: "stop"});
    continueProcessing = false;

    okButton.onClick = function() {
        errorDialog.close();
    }

    errorDialog.show();
}

function showScriptCompletionDialog(processedTables, totalTables, modifiedCellCount, tablesWithString, tablesWithoutString, userInputString) {
    // Create a new dialog window
    var dialog = new Window("dialog", "Script Selesai");

    // Set dialog properties
    dialog.orientation = "column";
    dialog.alignChildren = ["fill", "top"];
    dialog.margins = 20;

    // Add a panel for the main message
    var messagePanel = dialog.add("panel", undefined, "Hasil Proses");
    messagePanel.orientation = "column";
    messagePanel.alignChildren = ["fill", "top"];
    messagePanel.margins = 15;

    // Add static text elements for each piece of information
    messagePanel.add("statictext", undefined, "Tabel terproses: " + processedTables + " dari " + totalTables + " tabel.");
    messagePanel.add("statictext", undefined, "Jumlah cell terubah: " + modifiedCellCount + " cell.");
    messagePanel.add("statictext", undefined, "Jumlah tabel terubah: " + tablesWithString);
    
    // divider
    var divider = messagePanel.add("panel");
    divider.alignment = "fill"; 
    
    // Add static text for tables without the specified string
    messagePanel.add("statictext", undefined, "Tabel tidak diubah (tidak terdeteksi '" + userInputString + "'): " + tablesWithoutString);

    // Add a note about table titles
    messagePanel.add("statictext", undefined, "Catatan: Tulisan tiap judul tabel 'Tabel|Table' dibuat menggunakan tabel juga.");

    // Add an OK button to close the dialog
    var okButton = dialog.add("button", undefined, "OK", {name: "ok"});
    okButton.onClick = function() {
        dialog.close();
    };

    // Show the dialog
    dialog.show();
}

// Main function to run the script
function main() {
    if (!showInitialDialog()) {
        alert("Script dibatalkan.");
        return;
    }

    if (app.documents.length == 0) {
        alert("Belum ada dokumen yang aktif.");
        return;
    }

    var doc = app.activeDocument;
    var allTables = getAllTables(doc);
    var modifiedCellCount = 0;
    var tablesWithoutString = 0;
    var tablesWithString = 0;
    var totalTables = allTables.length;
    var processedTables = 0;

    for (var i = 0; i < allTables.length; i++) {
        var table = allTables[i];
        var startRow = findStartRow(table); //cari String dari input user

        if (doFollowProcessing) {
            // Mengikuti Gerakan Script untuk melihat langsung.
            if (table.parent instanceof TextFrame) {
                var textFrame = table.parent;
                app.activeWindow.activePage = textFrame.parentPage;
                app.activeWindow.zoom(ZoomOptions.FIT_PAGE);
                table.cells[0].insertionPoints[0].select();
            }
        }
        if (startRow !== null) {
            // Show confirmation dialog after processing each table
            if (continueProcessing===false) {
                var confirmResult = showTableConfirmationDialog();
                if (confirmResult === 1) { // "Lanjut"
                    // yaudah lanjut.
                } else if (confirmResult === 2) { // "Stop"
                    alert("Script Dihentikan.");
                    break;
                } else if (confirmResult === 3) { // "Lanjut Terus"
                    continueProcessing = true; // Gaspol
                } else if (confirmResult === 4) { // "Skip Tabel"
                    continue; // Skip Tabel
                }
            }
            modifiedCellCount += applyStylesToAllRows(table, startRow);
            tablesWithString++;
        } else {
            tablesWithoutString++;
        }

        processedTables++;
    }

    showScriptCompletionDialog(processedTables, totalTables, modifiedCellCount, tablesWithString, tablesWithoutString, userInputString);
}


// Function to get all tables in the document
function getAllTables(doc) {
  var allTables = [];
  for (var i = 0; i < doc.stories.length; i++) {
      var story = doc.stories[i];
      var tables = story.tables.everyItem().getElements();
      allTables = allTables.concat(tables);
  }
  return allTables;
}

// Function to find the first row with value of userInputString in the first column
function findStartRow(table) {
  for (var i = 0; i < table.rows.length; i++) {
      var firstCell = table.rows[i].cells[0];
      if (firstCell.contents.indexOf(userInputString) !== -1) {
          return i;
      }
  }
  return null;
}

function getLongestStringWidth(table, colIndex, startRow) {
  var longestString = "a";
  var maxWidth = 0;

  for (var i = startRow; i < table.rows.length; i++) {
      var cell = table.rows[i].cells[colIndex];
      var textContent = cell.texts[0].contents;
      // cell.fillColor = "Blue";
      if (textContent.length > longestString.length) {
          longestString = textContent;
      }
  }

  if (longestString.length > 0) {
    longestString = longestString.replace(/[\r\n\t]+/g, " ");
      // Create a temporary text frame to measure the text without formatting
      var tempTextFrame = app.activeDocument.textFrames.add();
      
      tempTextFrame.contents = longestString;
      
      tempTextFrame.fit(FitOptions.FRAME_TO_CONTENT);

      // Remove any styles that might be applied
      tempTextFrame.texts[0].appliedParagraphStyle = app.activeDocument.paragraphStyles.item("[No Paragraph Style]");
      tempTextFrame.texts[0].appliedCharacterStyle = app.activeDocument.characterStyles.item("[None]");

      // Clear any table styles if applicable
      if (tempTextFrame.texts[0].tables.length > 0) {
          var tables = tempTextFrame.texts[0].tables;
          for (var j = 0; j < tables.length; j++) {
              tables[j].appliedTableStyle = app.activeDocument.tableStyles.item("[None]");
          }
      }

      // Apply font and style
      try {
        tempTextFrame.parentStory.appliedFont = app.fonts.item(fontangkanya);
        tempTextFrame.parentStory.fontStyle = fontStyleangkanya;
    } catch (e) {
        // Fallback to a default font if Lato is not available
        tempTextFrame.parentStory.appliedFont = app.fonts.item("Arial");
        tempTextFrame.parentStory.fontStyle = "Bold";
        alert("Font "+fontangkanya+" dengan style "+fontStyleangkanya+" tidak ditemukan. \nMenggunakan Font Arial untuk mengukur!");
    }
    tempTextFrame.parentStory.pointSize = fontSizeangkanya;
        
        // Force text reflow
        tempTextFrame.texts[0].contents = tempTextFrame.texts[0].contents;

      // Ensure text frame is sized to fit content
      tempTextFrame.fit(FitOptions.FRAME_TO_CONTENT);

      // Calculate the width of the text content using geometricBounds
      maxWidth = tempTextFrame.geometricBounds[3] - tempTextFrame.geometricBounds[1];

      // Clean up temporary text frame
       tempTextFrame.remove();
  }
  longstring = longestString;
  return maxWidth;
}





// Function to apply styles to cells in all rows starting from startRow
function applyStylesToAllRows(table, startRow) {
    var modifiedCells = 0;
    for (var colIndex = 1; colIndex < table.columns.length; colIndex++) {
        var longestStringWidth = getLongestStringWidth(table, colIndex, startRow);
        var columnWidth = table.columns[colIndex].width;
        var isError = false;
      
        for (var rowIndex = startRow; rowIndex < table.rows.length; rowIndex++) {
            var cell = table.rows[rowIndex].cells[colIndex];
            // Reset right indentation first
            cell.paragraphs.everyItem().rightIndent = 0;

            // Apply right alignment
            cell.paragraphs.everyItem().justification = Justification.RIGHT_ALIGN;

            // Set vertical alignment to center
            cell.verticalJustification = VerticalJustification.CENTER_ALIGN;

            // Calculate right indentation
            var rightIndent;
            rightIndent = ((columnWidth - longestStringWidth)/2)-0.5; 

            try{
                cell.paragraphs.everyItem().appliedParagraphStyle = app.activeDocument.paragraphStyles.item("isi tabel");


            } catch(err) {
                alert("Paragraph Style isi tabel tidak ada di dokumen ini.\nHati-hati pada Last Line Right Indent yang bukan 0.");
            }
            try {
                // Apply right indentation
                cell.paragraphs.everyItem().rightIndent = rightIndent;
                
            } catch(err) {
                if(!isError){
                    var foundTextFrame = locateTextFrameWithStyle(app.activeDocument, "Judul Tabel Lamp INA");
                    var errorDetails = {
                        location: foundTextFrame ? foundTextFrame.contents : "Tidak diketahui",
                        rightIndent: rightIndent,
                        columnWidth: columnWidth,
                        longestStringWidth: longestStringWidth,
                        longstring: longstring,
                        adjustmethod: adjustmethod
                    };
                    isError = true;
                    continueProcessing = false;
                    showErrorDialog(errorDetails);
                }
            
                cell.paragraphs.everyItem().rightIndent = 0;
                cell.fillColor = "Yellow";
            }
          

            // Debug: Change fill color to highlight modified cells
            // cell.fillColor = "Yellow";

            modifiedCells++;
        }
    }
    return modifiedCells;
}

// Function to locate the nearest text frame with a specific paragraph style
function locateTextFrameWithStyle(doc, styleName) {
  var paragraphStyle = doc.paragraphStyles.item(styleName);

  if (!paragraphStyle.isValid) {
      return null;
  }

  for (var i = 0; i < doc.textFrames.length; i++) {
      var textFrame = doc.textFrames[i];
      for (var j = 0; j < textFrame.paragraphs.length; j++) {
          var paragraph = textFrame.paragraphs[j];
          if (paragraph.appliedParagraphStyle == paragraphStyle) {
              return textFrame; // Returns the first matching text frame
          }
      }
  }

  return null;
}

// Function to highlight tables without the target string
function highlightTableWithoutString(table) {
  for (var i = 0; i < table.rows.length; i++) {
      for (var j = 0; j < table.columns.length; j++) {
          table.rows[i].cells[j].fillColor = "Yellow";
      }
  }
}

// Run the main function
main();
