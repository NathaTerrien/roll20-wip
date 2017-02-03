# Swords & Wizardry

Character sheet for Swords & Wizardry, in english and french[english](http://barbariansoflemuria.webs.com/).
Initially created by Jacob Vann and overhauled by [Natha](https://github.com/NathaTerrien/roll20-wip/blob/master/README.md) (design, translation data, automated calcultations and rolls/roll template).

# Current version
2.0 [Screenshot](SWSheet.png)

The automated calculations (modifiers etc.) are based on the Complete version of the rules.
Every calculation can be overriden by manual input if house rules are used (but modifying the DEX value, for example, will compute again the AC modifier, and the custom values have to be input again).

# Release notes

##v2.0 (2017-02-04)

* Added missing derived attributes (min/mal spells)
* Automated calculations (by sheet workers) of derived attributes, when an attribute is modified (ex: modifying Strength will calculate the melee To-Hit mod, Damage mod, Carry mod, open door )
* New "Other" AC modifier to note magic items effect on AC (like rings) or curses, wounds, spell effects etc.
* Handling of Ascending and Descending AC (radio button). On change: 
  * Base AC is (re)set accordingly
  * DEX modifier to AC is calculted accordingly
  * Ascending AC is calculated by adding Base AC + DEX modifier + absolute value of Armor AC modifier + absolute value of Shield AC modifier + Other AC modifier
  * Descending AC is calculted by adding Base AC + DEX modifier - absolute value of Armor AC modifier - absolute value of Shield AC modifier + Other AC modifier
* Gear and Treasure weight are automatically tallied. Total gear weight sums every item weight, multiplied by quantity (unit weight assumed)
