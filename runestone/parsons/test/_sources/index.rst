Control + Visualization
------------------------

.. parsonsprob:: test_parsons_1
   :adaptive:
   :order: 0 1 2 3 4 5
   :cxvcontrol:
   :cxvvisualization:

   Define a function fib that takes in parameter n, and returns the nth number in the Fibonacci sequence.
   -----
   def fib(num):
   =====
   def fib: #paired
   =====
      if num == 0:
          return 0:
   =====
      if num == 1:
          return 1:
   =====
      return fib(num - 1) + fib(num - 2)
   =====
      return fib(num - 1) * fib(num - 2) #paired


Control + No Visualization
---------------------------

.. parsonsprob:: test_parsons_kk
   :adaptive:
   :order: 0 1 2 3 4 5
   :cxvcontrol:

   Define a function fib that takes in parameter n, and returns the nth number in the Fibonacci sequence.
   -----
   def fib(num):
   =====
   def fib: #paired
   =====
      if num == 0:
          return 0:
   =====
      if num == 1:
          return 1:
   =====
      return fib(num - 1) + fib(num - 2)
   =====
      return fib(num - 1) * fib(num - 2) #paired


No control + Visualization
---------------------------

.. parsonsprob:: test_parsons_99
   :adaptive:
   :order: 0 1 2 3 4 5
   :cxvvisualization:

   Define a function fib that takes in parameter n, and returns the nth number in the Fibonacci sequence.
   -----
   def fib(num):
   =====
   def fib: #paired
   =====
      if num == 0:
          return 0:
   =====
      if num == 1:
          return 1:
   =====
      return fib(num - 1) + fib(num - 2)
   =====
      return fib(num - 1) * fib(num - 2) #paired

No control + No visualzation
-----------------------------

.. parsonsprob:: test_parsons_000
   :adaptive:
   :order: 0 1 2 3 4 5

   Define a function fib that takes in parameter n, and returns the nth number in the Fibonacci sequence.
   -----
   def fib(num):
   =====
   def fib: #paired
   =====
      if num == 0:
          return 0:
   =====
      if num == 1:
          return 1:
   =====
      return fib(num - 1) + fib(num - 2)
   =====
      return fib(num - 1) * fib(num - 2) #paired

