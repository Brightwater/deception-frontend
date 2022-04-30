/* eslint-disable vue/no-mutating-props */
/* eslint-disable prettier/prettier */ /* eslint-disable prettier/prettier */
<!-- 
TO CREATE A <fluid-table> :
Example: 
  <fluid-table 
    id="tableId"    | String
    width="700px"   | CSS width/height value (optional)
    height="700px"  | CSS width/height value (NO percentages)
    headers='[{key: "time", editable: true, text: "Time"}]' | JSON Array with: key, editable, text
    tableJSON='[{pKey: "0", time: "00:00:02 AM"}]'  | JSON Array with pKey and whatever else
    skipIndexes='["pKey"]'                          | Array (optional); will ignore given columns by their key
    tableColor="rgba(60,60,60,.75)">                | rgb or rgba value (optional)
  </fluid-table>

------------------------------------------------------------------------------------------

KNOWN BUGS: 
1) When editing, your cursor will default to the end after every character. (initial bug until the reverse bug can be solved)
*2) FIXED: Edited stuff can't be sorted (The edit specifically only applies to the row/column; and can cause duplicate JSON items when sorted)
  try to fix by using pkey instead of whatever 
3) Sorting with both numbers and text will vary results (sometimes text is first, sometimes it's bottom, sometimes stuck in the middle..)
  solution: type verification
4) If you select all text and hit backspace when editing it will cause issue (2)
5) contenteditable is terrible.
6) If you place a new line when editing it will remove the edit.

FUTURE FEATURES:
1) Add row
    A. Modal sub component ------ Didn't seem necessary since this is a JSON edit, no DOM manipulation needed
    B. Drop down ()sub component?) with options ------- what options?
2) Delete row ------- Rows can be deleted by pKeys now (if no pKeys then it would be a DOM edit only- should that be included?)
3) edit row ------- nou
4) Update contenteditable (<td>) into <input> or <textarea> and adjust CSS acordingly
5) Use keys instead of indexes and remove skipIndexes and get all needed info from headers[] instead
-->
<template>
  <div class="FluidTable">
    <div
      v-bind:id="this.id"
      v-bind:style="{
        width: this.width,
        height: this.height,
        overflowY: 'auto',
        display: 'block',
      }"
    >
      <table>
        <thead>
          <tr>
            <th
              v-for="(header, index) in headers"
              :key="index"
              v-on:click="sortByColumn(index, $event)"
            >
              {{ header.text }}
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- VERSION 1.0
            <template v-for="(record, index) in tableJSON">
              <tr v-bind:id="id + '' + index" :key="index">
                <template v-for="(data, column) of record">
                  <template v-if="!skipIndexes.includes(column)"> <!-/- ignore skipped columns -/->
                    <template v-if="headers.find(header => header.key === column).editable == true"> <!-/- Checks if editable -/->
                      <td :key="column" contenteditable @input="updateJSON($event, record.pKey, column)"> <!-/- .pKey specific -/->
                        {{data}}
                      </td>
                    </template>
                    <template v-else>
                      <td :key="column">
                        {{data}}
                      </td>
                    </template>
                  </template>
                </template>
              </tr>
          </template> -->
          <!-- VERSION 1.1
            <tr v-for="(record, index) in tableJSON" :key="index" :id="id + '' + index">
              <template v-for="(data, column) of record">
                  <td v-if="getHeaderKeys().includes(column) && headers.find(header => header.key === column).editable == true" :key="column"> <!-/- .pKey specific -/->
                    <input :value="record[column]" />
                  </td>
                  <td v-else-if="getHeaderKeys().includes(column)" :key="column">
                    {{record[column]}}
                  </td>
              </template>
            </tr>
            -->
          <tr
            v-for="(record, index) in tableJSON"
            :key="index"
            :id="id + '' + index"
          ></tr>
        </tbody>
      </table>
    </div>
    <template v-if="Boolean(this.editMode) === true">
      <button title="Edit" value="Edit">{{ editMode }}</button>
    </template>
  </div>
</template>

<script>
export default {
  data: () => ({
    name: "FluidTable",
    priorSort: false, // used in sortByColumn(): ASC/DESC
    boolSort: false, // used in sortByColumn(): ASC/DESC
    originalCol: 0, // used in sortByColumn(): secondary sorting
    primeSort: false, // used in sortByColumn(): secondary sorting && ASC/DESC
    endEvent: false, // used in updateJSON(): signifies end of event
  }),

  props: {
    id: { type: String, required: true },
    width: { type: String },
    height: { type: String, required: true },
    headers: { type: Array, required: true }, // if using skipIndexes, ignore their headers in order
    tableJSON: { type: Array, required: true },
    tableColor: { type: String, default: "rgb(110, 15, 45)" },
    skipIndexes: { type: Array }, // obsolete
    editMode: { type: Boolean, default: false },
  },

  methods: {
    // Returns keys in headers [for use in template]
    getHeaderKeys() {
      let keys = [];

      for (let header of this.headers) {
        keys.push(header.key);
      }

      return keys;
    },
    removeSpobs() {
      console.log("Removing spobs");
      let temp = [{}];
      // for (let spob of this.skipIndexes) {
      //   for (let record of temp) {
      //     delete record[spob];
      //   }
      // }

      for (let record of this.tableJSON) {
        let temp2 = {};
        for (let header of this.headers) {
          for (let [key, value] of Object.entries(record)) {
            if (header.key === key) {
              temp2[key] = value;
              continue;
            }
          }
          if (!temp2) {
            break;
          }
        }
        // console.log(record)
        temp.push(temp2);
      }
      temp.splice(0, 1);
      console.log(temp);
    },

    // Supports secondary sorting with ctrl-click on 2nd
    sortByColumn(intColumnNum, event) {
      let key, key2;

      // Checking if ASC/DESC sort is selected
      if (this.priorSort == this.id + intColumnNum && this.boolSort == false) {
        this.boolSort = true;
      } else {
        this.boolSort = false;
      }
      this.priorSort = this.id + intColumnNum;

      // Checks if ctrl-clicked:
      if (!event.ctrlKey) {
        // Setting primary column
        key = document.getElementById(this.id).childNodes[0].childNodes[0]
          .childNodes[0].childNodes[intColumnNum].innerHTML;
        this.originalCol = intColumnNum;
        this.primeSort = this.boolSort;
      } else {
        // Setting secondary key
        key = document.getElementById(this.id).childNodes[0].childNodes[0]
          .childNodes[0].childNodes[this.originalCol].innerHTML;
        key2 = document.getElementById(this.id).childNodes[0].childNodes[0]
          .childNodes[0].childNodes[intColumnNum].innerHTML;
        for (let index in this.headers) {
          if (this.headers[index].text.trim() === key2.trim()) {
            key2 = this.headers[index].key.trim();
          }
        }
      }

      // Setting primary key
      for (let index in this.headers) {
        if (this.headers[index].text.trim() === key.trim()) {
          key = this.headers[index].key.trim();
        }
      }

      // Copying boolSort (for some reason js refuses to acknowledge its existence otherwise..even tho it works right there^)
      let ascending = this.boolSort;
      let primeAscending = this.primeSort;

      // Sorting JSON
      // eslint-disable-next-line vue/no-mutating-props
      this.tableJSON.sort(function (a, b) {
        // Setting up primary values:
        let primeA, primeB;
        try {
          primeA = a[key];
          if (isNaN(primeA) && primeA.length >= 1) {
            // String:
            primeA.trim().toLowerCase();
          } else if (!isNaN(primeA)) {
            // Number:
            // do nothing
          } else {
            // null:
            throw Error("JSON sorting null value");
          }
        } catch {
          primeA = null;
        }
        try {
          primeB = b[key];
          if (isNaN(primeB) && primeB.length >= 1) {
            // String:
            primeB.trim().toLowerCase();
          } else if (!isNaN(primeB)) {
            // Number:
            // do nothing
          } else {
            // null:
            throw Error("JSON sorting null value");
          }
        } catch {
          // null
          primeB = null;
        }

        // Setting up secondary values:
        let a2, b2;
        if (event.ctrlKey) {
          try {
            a2 = a[key2];
            if (isNaN(a2) && a2.length >= 1) {
              // String:
              a2.trim().toLowerCase();
            } else if (!isNaN(a2)) {
              // Number:
              // do nothing
            } else {
              // null:
              throw Error("JSON sorting null value");
            }
          } catch {
            a2 = null;
          }
          try {
            b2 = b[key2];
            if (isNaN(b2) && b2.length >= 1) {
              // String:
              b2.trim().toLowerCase();
            } else if (!isNaN(b2)) {
              // Number:
              // do nothing
            } else {
              // null:
              throw Error("JSON sorting null value");
            }
          } catch {
            // null
            b2 = null;
          }
        }

        // Checks if ctrl-clicked
        if (event.ctrlKey) {
          // Sorting w/ secondary: (nulls last)
          if (primeA === null) {
            return 1;
          } else if (primeB === null) {
            return -1;
          } else if (ascending) {
            if (primeA == primeB) {
              // secondary:
              if (a2 === null) {
                return 1;
              } else if (b2 === null) {
                return -1;
              } else {
                return a2 === b2 ? 0 : a2 < b2 ? -1 : 1;
              }
            } else {
              // primary:
              if (primeAscending) {
                return primeA < primeB ? -1 : 1;
              } else {
                return primeA < primeB ? 1 : -1;
              }
            }
          } else {
            // secondary descending:
            if (primeA == primeB) {
              // secondary:
              if (a2 === null) {
                return 1;
              } else if (b2 === null) {
                return -1;
              } else {
                return a2 === b2 ? 0 : a2 < b2 ? 1 : -1;
              }
            } else {
              if (primeAscending) {
                // primary:
                return primeA < primeB ? -1 : 1;
              } else {
                return primeA < primeB ? 1 : -1;
              }
            }
          }
        } else {
          // Primary sorting: (nulls last)
          if (primeA === null) {
            return 1;
          } else if (primeB === null) {
            return -1;
          } else if (ascending) {
            return primeA == primeB ? 0 : primeA < primeB ? -1 : 1;
          } else {
            // descending:
            return primeA == primeB ? 0 : primeA < primeB ? 1 : -1;
          }
        }
      });

      // Sets scroll bar back to 0
      document.getElementById(this.id).scrollTop = 0;

      // DECLARATION: *******************************************************************************
      let strTest = "";
      if (!this.boolSort) {
        strTest = "Descending ";
      } else {
        strTest = "Ascending ";
      }
      strTest +=
        "sort applied on column [" +
        document.getElementById(this.id).childNodes[0].childNodes[0]
          .childNodes[0].childNodes[intColumnNum].innerHTML +
        "]";
      console.log(strTest);
    },

    // Very buggy atm (See top of file)
    updateJSON(event, pKey, columnKey) {
      let newText = event.srcElement.innerText;
      let record = this.tableJSON.find((record) => record.pKey === pKey); // JSON record

      record[columnKey] = newText; // updates JSON

      // Removes excess text that gets added by contenteditable:
      if (event.srcElement.childNodes.length > 1) {
        event.srcElement.removeChild(event.srcElement.childNodes[0]);
      }

      this.setEndOfContenteditable(event.srcElement); // temporary fix for cursor defaulting to 0
    },
    //https://stackoverflow.com/questions/1125292/how-to-move-cursor-to-end-of-contenteditable-entity
    setEndOfContenteditable(contentEditableElement) {
      // used in updateJSON()
      var range, selection;
      if (document.createRange) {
        //Firefox, Chrome, Opera, Safari, IE 9+
        range = document.createRange(); //Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement); //Select the entire contents of the element with the range
        range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection(); //get the selection object (allows you to change selection)
        selection.removeAllRanges(); //remove any selections already made
        selection.addRange(range); //make the range you have just created the visible selection
      } else if (document.selection) {
        //IE 8 and lower
        range = document.body.createTextRange(); //Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement); //Select the entire contents of the element with the range
        range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
        range.select(); //Select the range (make it the visible selection
      }
    },

    // Works with pKeys only
    removeRow(pKey) {
      let removeWorked = false;
      for (let index in this.tableJSON) {
        let object = this.tableJSON[index];
        if (object["pKey"] == pKey) {
          console.warn(
            "removeRow() : The following row is being removed: (pKey: " +
              pKey +
              ")"
          );
          console.warn(object);
          // eslint-disable-next-line vue/no-mutating-props
          this.tableJSON.splice(index, 1);
          removeWorked = true;
        }
      }

      if (!removeWorked) {
        console.warn("removeRow() : pKey: " + pKey + " was not found.");
      }
    },

    // Can add multiple rows at once
    addRow(strJSON) {
      try {
        strJSON = JSON.parse(strJSON);

        // Checks original keys:
        let keys = [];
        for (let key of Object.keys(this.tableJSON[0])) {
          keys.push(key.trim());
        }

        // Checks if there's unmatched keys
        let error = false;
        let badKeys = new Set();
        for (let object of strJSON) {
          for (let keyType of Object.keys(object)) {
            if (!keys.includes(keyType.trim())) {
              // gets all bad keys
              error = true;
              badKeys.add(keyType);
            }
          }
        }
        if (error) {
          throw Error("Unknown keys found: " + Array.from(badKeys).join(", "));
        }

        // Checks for nulls / empty values (no matched keys)
        for (let object of strJSON) {
          for (let key of keys) {
            let keyTypes = Object.keys(object);
            if (!keyTypes.includes(key)) {
              object[key] = null;
            }
          }
          // Adds object
          // eslint-disable-next-line vue/no-mutating-props
          this.tableJSON.push(object);
        }
      } catch (error) {
        console.error("addRow() : " + error.message);
      }
    },

    addTheme(rgbColor) {
      // only includes 1 theme atm
      if (!rgbColor.includes("rgb")) {
        console.error("Color Schemer was not given a rgb/rgba value.");
        throw new Error("Color Schemer cannot use:" + rgbColor);
      }
      if (!rgbColor.includes("rgba")) {
        rgbColor =
          rgbColor.substring(0, 3) +
          "a" +
          rgbColor.substring(3, rgbColor.indexOf(")")) +
          ", 1)";
      }

      let splicedRGB = rgbColor.split(",");
      let red = Number(splicedRGB[0].substring(5, splicedRGB[0].length).trim());
      let green = Number(splicedRGB[1].trim());
      let blue = Number(splicedRGB[2].trim());
      let opacity = Number(splicedRGB[3].trim().replace(")", ""));

      let original = rgbColor;
      /*let light = 
        'rgba(' + 
        (red + 10) + ', ' + 
        (green + 10) + ', ' + 
        (blue + 10) + ', ' + 
        opacity + ')'; */
      let header =
        "rgba(" +
        (red + 25) +
        ", " +
        (green + 25) +
        ", " +
        (blue + 25) +
        ", " +
        opacity +
        ")";
      let hover =
        "rgba(" +
        (red + 40) +
        ", " +
        (green + 40) +
        ", " +
        (blue + 40) +
        ", " +
        opacity +
        ")";
      let dark =
        "rgba(" +
        (red - 10) +
        ", " +
        (green - 10) +
        ", " +
        (blue - 10) +
        ", " +
        opacity +
        ")";
      let lightText =
        "rgba(" +
        (red + 150) +
        ", " +
        (green + 150) +
        ", " +
        (blue + 150) +
        ", " +
        opacity +
        ")";
      let darkText =
        "rgba(" +
        (red - 150) +
        ", " +
        (green - 150) +
        ", " +
        (blue - 150) +
        ", " +
        opacity +
        ")";

      let originalTextColor = darkText;
      let lightTextColor = darkText;
      let headerTextColor = darkText;
      let darkTextColor = darkText;

      if (red + green + blue - 30 < 290) {
        darkTextColor = lightText;
      }
      if (red + green + blue < 320) {
        originalTextColor = lightText;
      }
      if (red + green + blue + 30 < 350) {
        // eslint-disable-next-line no-unused-vars
        lightTextColor = lightText;
      }
      if (red + green + blue + 75 < 450) {
        headerTextColor = lightText;
      }

      let arrColors;
      arrColors = [
        // Header:
        original,
        header,
        header,
        headerTextColor,
        headerTextColor,
        // Header Hover:
        hover,
        hover,
        headerTextColor,
        headerTextColor,
        // Columns:
        original,
        original,
        originalTextColor,
        originalTextColor,
        // Rows:
        dark,
        dark,
        darkTextColor,
        darkTextColor,
      ];
      this.updateScheme(arrColors);
    },

    updateScheme(arrColors) {
      // for use in addTheme()
      document.documentElement.style.setProperty("--tableColor", arrColors[0]);
      document.documentElement.style.setProperty("--headerColor", arrColors[1]);
      document.documentElement.style.setProperty(
        "--headerColor2",
        arrColors[2]
      );
      document.documentElement.style.setProperty(
        "--headerTextColor",
        arrColors[3]
      );
      document.documentElement.style.setProperty(
        "--headerTextColor2",
        arrColors[4]
      );
      document.documentElement.style.setProperty(
        "--headerColorHover",
        arrColors[5]
      );
      document.documentElement.style.setProperty(
        "--headerColorHover2",
        arrColors[6]
      );
      document.documentElement.style.setProperty(
        "--headerTextColorHover",
        arrColors[7]
      );
      document.documentElement.style.setProperty(
        "--headerTextColorHover2",
        arrColors[8]
      );
      document.documentElement.style.setProperty("--columnColor", arrColors[9]);
      document.documentElement.style.setProperty(
        "--columnColor2",
        arrColors[10]
      );
      document.documentElement.style.setProperty(
        "--columnTextColor",
        arrColors[11]
      );
      document.documentElement.style.setProperty(
        "--columnTextColor2",
        arrColors[12]
      );
      document.documentElement.style.setProperty("--rowColor", arrColors[13]);
      document.documentElement.style.setProperty("--rowColor2", arrColors[14]);
      document.documentElement.style.setProperty(
        "--rowTextColor",
        arrColors[15]
      );
      document.documentElement.style.setProperty(
        "--rowTextColor2",
        arrColors[16]
      );
    },
  },

  created() {
    /*
    // TESTING:
    let strJSON = '[{' +
      '"date": "07-07-2020",' +
      '"time": "12:04:20 AM"' +
      '}, {' + 
      '"date": "07-07-2020",' +
      '"time": "12:06:09 PM"' +
      '}]';
    
    setTimeout(() => { // Timeout required to ensure tableJSON is initialized
      this.addRow(strJSON);
      this.removeRow("268");
    }, 500); 
    */
    // PERMANENT:
    this.addTheme(this.tableColor);
    this.removeSpobs();
  },
};
</script>

<style>
:root {
  /* --tableColor: lightseagreen;
  --headerColor: rgb(25, 150, 140);
  --headerColor2: rgb(25, 150, 140);
  --headerTextColor: white;
  --headerTextColor2: white;
  --headerColorHover: rgb(70, 190, 180);
  --headerColorHover2: rgb(70, 190, 180);
  --headerTextColorHover: white;
  --headerTextColorHover2: white;
  --columnColor: lightseagreen;
  --columnColor2: lightblue;
  --columnTextColor: black;
  --columnTextColor2: black;
  --rowColor: rgb(170, 200, 210);
  --rowColor2: rgb(35, 170, 160);
  --rowTextColor: black;
  --rowTextColor2: black;
   */
  --navText: rgba(215, 215, 255, 1);
  --navLight: rgba(30, 30, 70, 1);
  --navOriginal: rgba(15, 15, 55, 1);
  --navDark: rgba(0, 0, 40, 1);
  --tableColor: rgba(25, 25, 65, 1);
  --headerColor: rgba(50, 50, 90, 1);
  --headerColor2: rgba(50, 50, 90, 1);
  --headerTextColor: rgba(175, 175, 215, 1);
  --headerTextColor2: rgba(175, 175, 215, 1);
  --headerColorHover: rgba(65, 65, 105, 1);
  --headerColorHover2: rgba(65, 65, 105, 1);
  --headerTextColorHover: rgba(175, 175, 215, 1);
  --headerTextColorHover2: rgba(175, 175, 215, 1);
  --columnColor: rgba(25, 25, 65, 1);
  --columnColor2: rgba(25, 25, 65, 1);
  --columnTextColor: rgba(175, 175, 215, 1);
  --columnTextColor2: rgba(175, 175, 215, 1);
  --rowColor: rgba(15, 15, 55, 1);
  --rowColor2: rgba(15, 15, 55, 1);
  --rowTextColor: rgba(175, 175, 215, 1);
  --rowTextColor2: rgba(175, 175, 215, 1);

  --borderRadius: 0px;
  --padding: 10px;
  
}

table {
  border-top-right-radius: var(--borderRadius);
  border-top-left-radius: var(--borderRadius);
  border-spacing: 0;
  padding: 0;
  width: 100%;
}
/* START OF: Headers */
thead {
  position: sticky;
  top: 0;
}
thead th {
  padding: var(--padding);
  background-color: var(--headerColor);
  color: var(--headerTextColor);
}
thead th:first-child {
  border-top-left-radius: var(--borderRadius);
}

thead th:last-child {
  border-top-right-radius: var(--borderRadius);
}
thead th:nth-child(even) {
  background-color: var(--headerColor2);
  color: var(--headerTextColor2);
}
thead th:hover {
  background-color: var(--headerColorHover);
  color: var(--headerTextColorHover);
}
thead th:nth-child(even):hover {
  background-color: var(--headerColorHover2);
  color: var(--headerTextColorHover2);
}
/* END OF: Headers */

/* START OF: Columns */
tbody tr td {
  padding: var(--padding);
  background-color: var(--columnColor);
  color: var(--columnTextColor);
  border-right: 3px solid rgba(255, 255, 255, 0.05);
}
tbody tr td:focus {
  /* currently not optimized for other themes */
  outline: none;
  box-shadow: inset 0px 0px 5px 0px var(--columnTextColor);
}
tbody tr td:nth-child(even) {
  background-color: var(--columnColor2);
  color: var(--columnTextColor2);
}
tbody tr td:last-child {
  border: none;
}
/* END OF: Columns */

/* START OF: Rows */
tbody tr:nth-child(even) td:nth-child(even) {
  background-color: var(--rowColor);
  color: var(--rowTextColor);
}
tbody tr:nth-child(even) td:nth-child(odd) {
  background-color: var(--rowColor2);
  color: var(--rowTextColor2);
}
/* END OF: Rows */
/* START OF: Inputs */
input {
  -webkit-appearance: none;
  appearance: none;
  outline: none;
  border: none;
  box-shadow: none;
  background-color: rgba(0, 0, 0, 0);
  color: var(--rowTextColor);
  display: block;
}
/* END OF: Inputs */
/* START OF: Scroll Bar*/
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-track {
  background-color: var(--columnColor);
  border-radius: var(--borderRadius);
}
::-webkit-scrollbar-track:hover {
  background-color: var(--tableColor);
}
::-webkit-scrollbar-thumb {
  background-color: var(--headerColor);
  border-radius: var(--borderRadius);
}
::-webkit-scrollbar-corner {
  background-color: var(--columnColor);
}
/* END OF: Scroll Bar */
/* START OF: Buttons */
/* button {
  float: left;
  top: 0;
  width: 60px;
  height: 30px;
  display: block;
  border: 1px solid white;
} */
/* END OF: Buttons */
</style>
