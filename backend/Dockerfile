FROM nvidia/cuda:11.8.0-devel-ubuntu22.04

RUN apt-get update -y --fix-missing && apt-get upgrade -y
RUN apt-get install -y ffmpeg python3 python3-pip imagemagick
RUN python3 -m pip install --upgrade pip
RUN sed -i '/<policy domain="path" rights="none" pattern="@\*"/d' /etc/ImageMagick-6/policy.xml

WORKDIR /app
COPY requirements.txt /app/
RUN python3 -m pip install -r requirements.txt
COPY src/ /app/
CMD [ "runserver.sh" ]