Web Console for Raspberry Pi
============================

A simple web console for Raspberry Pi based on PHP and Javascript. LGPL licensed (The GNU Lesser General Public License, version 3.0 or any late versions).

Prepare
-------

To run this console, you'l need a web server installed on your Raspberry Pi (e.g. Nginx, Apache HTTPd), as well as PHP interpreter (version >= 5.4) with following extensions:
- json
- session

Be sure to comment `disable_functions` in `php.ini`, the script will use `popen()` to run commands and queries (e.g. `uname -a`)

Install
-------

There are no complicated processes during this section, all you needs to do is to paste the files to the document root of your web server.

Security
-------

The default user and password are `admin`. To change it or add more user, modify the contents in `cgi-root/supermarcus/Constants.php`
