==========================================
Test: Horizontal Parsons Problems with SQL
==========================================


Examples
========
Randomized Block with Regex Execution Feedback
----------------------------------------------
.. hparsons:: test_hparsons_regex_1
    :language: regex
    :randomize:

    Match words that starts with a vowel (a, e, i, o, u)
    ~~~~
    --blocks--
    [aeiou]
    [a-z]
    *
    [^aeiou]
    --pyunittest--
    from unittest.gui import TestCaseGui

    class myTests(TestCaseGui):

       def testOne(self):
           self.assertEqual(strict_match(regex,'banana'),None,"testcase: 'banana'")
           self.assertEqual(strict_match(regex, 'apple'), 'apple', "testcase: 'apple'")
    
    myTests().main()

.. hparsons:: test_hparsons_regex_2
    :language: regex
    :randomize:

    Testing Randomized block with regex execution feedback
    ~~~~
    --blocks--
    "
    "
    .
    +?
    +
    --pyunittest--
    from unittest.gui import TestCaseGui

    class myTests(TestCaseGui):

       def testOne(self):
           self.assertEqual(re.findall(regex,'My favorite musicals are "Rent", "Chicago", and "Dear Evan Hansen"'),['"Rent"','"Chicago"','"Dear Evan Hansen"'],'My favorite musicals are "Rent", "Chicago", and "Dear Evan Hansen"')
           self.assertEqual(re.findall(regex,'I am allergic to "mango" and "kiwi fruit"'),['"mango"','"kiwi fruit"'],'I am allergic to "mango" and "kiwi fruit"')
    
    myTests().main()

.. activecode:: testunits2
   :nocodelens:

   Fix the following code so that it always correctly adds two numbers.
   ~~~~
   def add(a,b):
      return 4

   ====
   from unittest.gui import TestCaseGui

   class myTests(TestCaseGui):

       def testOne(self):
           self.assertEqual(add(2,2),4,"A feedback string when the test fails")
           self.assertAlmostEqual(add(2.0,3.0), 5.0, 5, "Try adding your parameters")

   myTests().main()



Randomized Block with Block Based Feedback
------------------------------------------
.. hparsons:: test_hparsons_block_1
    :language: sql
    :dburl: /_static/test.db
    :randomize:
    :blockanswer: 0 1 2 3

    This is a horizontal Parsons problem! Feedback is based on block for this problem.
    The blocks are randomized, but cannot be reused ;)
    ~~~~
    --blocks--
    SELECT 
    *
    FROM
    test


Randomized Block with Block Based Feedback - Python highlighting
----------------------------------------------------------------
.. hparsons:: test_hparsons_block_2
    :language: python
    :dburl: /_static/test.db
    :randomize:
    :blockanswer: 0 1 2 3

    Python highlighting for keywords
    ~~~~
    --blocks--
    return
    test
    or
    None


Randomized Block with Block Based Feedback - Java highlighting
----------------------------------------------------------------
.. hparsons:: test_hparsons_block_3
    :language: java 
    :dburl: /_static/test.db
    :randomize:
    :blockanswer: 0 1 2 3 4 5

    Java highlighting for keywords
    ~~~~
    --blocks--
    public
    static
    Short 
    ERROR
    =
    0x0001;


Randomized Block with Execution Based Feedback
----------------------------------------------
.. hparsons:: test_hparsons_sql_1 
    :language: sql
    :dburl: /_static/test.db
    :randomize:

    This is a horizontal Parsons problem! Feedback is based on code execution.
    The blocks are randomized, but cannot be reused ;)
    ~~~~
    --blocks--
    SELECT 
    *
    FROM
    test
    --unittest--
    assert 1,1 == world
    assert 0,1 == hello
    assert 2,1 == 42


Reusable Block with Execution Based Feedback
--------------------------------------------
.. hparsons:: test_hparsons_sql_2 
    :language: sql
    :dburl: /_static/test.db
    :reuse:

    This is a horizontal parsons problem! Feedback is base on code execution.
    The blocks are set as the original order, and can be used multiple times.
    To delete a block, simply drag out of the input area.
    These features might not be so useful in the context of SQL, but might be useful in regex.
    ~~~~
    --blocks--
    SELECT 
    *
    FROM
    test
    --unittest--
    assert 1,1 == world
    assert 0,1 == hello
    assert 2,1 == 42
